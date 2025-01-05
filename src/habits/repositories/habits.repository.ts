import { Injectable } from '@nestjs/common';
import { Habit } from '../entities/habit.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { GetAllHabitsQueryDto } from '../dto';

@Injectable()
export class HabitsRepository extends Repository<Habit> {
  constructor(dataSource: DataSource) {
    super(Habit, dataSource.createEntityManager());
  }
  async findByOptions(
    options: GetAllHabitsQueryDto,
  ): Promise<[Habit[], number]> {
    let filters = {};
    if (options.search) {
      const searchString = `%${options.search}%`;
      filters = [
        { title: ILike(searchString) },
        { description: ILike(searchString) },
      ];
    }
    const [items, count] = await Promise.all([
      this.find({
        where: filters,
        skip: options.offset,
        take: options.limit,
      }),
      this.count({
        where: filters,
      }),
    ]);
    return [items, count];
  }

  async findByOptionsQB(
    options: GetAllHabitsQueryDto,
  ): Promise<[Habit[], number]> {
    const qb = this.createQueryBuilder('h');
    if (options.search) {
      const searchString = `%${options.search}%`;
      qb.where('("h"."title" ILIKE :searchString)', { searchString }).orWhere(
        '("h"."description" ILIKE :searchString)',
        { searchString },
      );
    }
    qb.skip(options.offset).take(options.limit);

    return qb.getManyAndCount();
  }
}
