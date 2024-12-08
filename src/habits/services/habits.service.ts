import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateHabitDto, UpdateHabitDto } from '../dto';
import { randomUUID, UUID } from 'crypto';
import { Habit } from '../entities/habit.entity';
import { HabitsValidationService } from './habits-validation.service';
import { DBConnection } from '../connections/db.connection';
import { IHabitsValidationService } from './habits-validation.interface';
// import { DBConnection } from '../connections/db.connection';

@Injectable()
export class HabitsService {
  constructor() {} // @Inject('CONNECTION') private readonly connection: DBConnection, //@Inject('VALIDATION') private readonly validationService: IHabitsValidationService, // private readonly validationService: HabitsValidationService, // @Inject(forwardRef(() => HabitsValidationService))

  private habits: Habit[] = [];

  create(createHabitDto: CreateHabitDto): Habit {
    const id = randomUUID();
    this.habits.push({ id, ...createHabitDto });
    // this.validationService.validate();
    // this.connection.ping()
    return this.findOne(id);
  }

  findAll(): Habit[] {
    return this.habits;
  }

  findOne(id: UUID): Habit | null {
    const habit = this.habits.find((h) => h.id === id);
    if (!habit) {
      console.error(`Habit ${id} not found`);
      return;
    }
    return habit || null;
  }

  findOneIndex(id: UUID): number | null {
    const habitIndex = this.habits.findIndex((h) => h.id === id);
    return habitIndex === -1 ? null : habitIndex;
  }

  update(id: UUID, updateHabitDto: UpdateHabitDto): Habit | null {
    const habitIndex = this.findOneIndex(id);
    if (!habitIndex) {
      console.error(`Habit ${id} not found`);
      return;
    }
    this.habits[habitIndex] = { ...this.habits[habitIndex], ...updateHabitDto };
    return this.findOne(id);
  }

  remove(id: UUID): void {
    const habitIndex = this.findOneIndex(id);
    if (!habitIndex) {
      console.error(`Habit ${id} not found`);
      return;
    }
    this.habits.splice(habitIndex, 1);
  }
}
