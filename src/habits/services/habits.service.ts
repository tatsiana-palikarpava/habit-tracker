import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHabitDto, GetAllHabitsQueryDto, UpdateHabitDto } from '../dto';
import { Habit } from '../entities/habit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HABIT_ERRORS } from '../constants';
import { HabitsRepository } from '../repositories/habits.repository';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { HabitCompletion } from '../entities/habit-completion.entity';
import * as moment from 'moment';

@Injectable()
export class HabitsService {
  constructor(
    // @InjectRepository(Habit) private habitsRepository: Repository<Habit>,
    private habitsRepository: HabitsRepository,
    private dataSource: DataSource,
    @InjectRepository(HabitCompletion)
    private habitCompletionsRepository: Repository<HabitCompletion>,
  ) {}

  async create(createHabitDto: CreateHabitDto): Promise<Habit> {
    const habitInstance = this.habitsRepository.create(createHabitDto);
    const habit = await this.habitsRepository.save(habitInstance);
    return habit;
  }

  async trackHabitCompletion(id: number): Promise<void> {
    const habit = await this.findOneOrFail(id);
    const latestHabitCompletion = await this.habitCompletionsRepository.findOne(
      {
        where: { habitId: id },
        order: { createdAt: 'desc' },
      },
    );
    if (latestHabitCompletion) {
      if (
        moment().diff(moment(latestHabitCompletion.createdAt), 'minutes') <
        habit.frequency
      ) {
        throw new BadRequestException(HABIT_ERRORS.ALREADY_COMPLETED);
      }
    }
    // await this.habitCompletionsRepository.save({ habitId: id });
    // await this.habitsRepository.update({ id }, { completionsCount: habit.completionsCount + 1 });
    await this.habitsRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const habitCompletionsRepository =
          entityManager.getRepository(HabitCompletion);
        const habitsRepository = entityManager.getRepository(Habit);
        await habitCompletionsRepository.save({ habitId: id });
        await habitsRepository.update(
          { id },
          { completionsCount: habit.completionsCount + 1 },
        );
      },
    );
  }

  async findAll(options: GetAllHabitsQueryDto): Promise<[Habit[], number]> {
    return this.habitsRepository.findByOptionsQB(options);
  }

  async findOneOrFail(id: number): Promise<Habit> {
    const habit = await this.habitsRepository.findOneBy({ id });
    if (!habit) {
      throw new NotFoundException(HABIT_ERRORS.HABIT_NOT_FOUND);
    }
    return habit;
  }

  async update(id: number, updateHabitDto: UpdateHabitDto): Promise<Habit> {
    await this.findOneOrFail(id);
    await this.habitsRepository.update({ id }, updateHabitDto);
    return this.habitsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.findOneOrFail(id);
    this.habitsRepository.delete({ id });
  }
}
