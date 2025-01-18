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
    userId: number,
  ): Promise<[Habit[], number]> {
    let filters: any = { userId };
    if (options.search) {
      const searchString = `%${options.search}%`;
      filters = [
        { title: ILike(searchString), ...filters },
        { description: ILike(searchString), ...filters },
      ];
    }
    const [items, count] = await Promise.all([
      this.find({
        where: filters,
        skip: options.offset,
        take: options.limit,
        order: {
          completionsCount: 'DESC',
        },
      }),
      this.count({
        where: filters,
      }),
    ]);
    return [items, count];
  }

  async findByOptionsQB(
    options: GetAllHabitsQueryDto,
    userId: number,
  ): Promise<[Habit[], number]> {
    const qb = this.createQueryBuilder('h');
    qb.where('"h"."userId" = :userId', { userId });
    if (options.search) {
      const searchString = `%${options.search}%`;
      qb.andWhere(
        '(("h"."title" ILIKE :searchString) OR ("h"."description" ILIKE :searchString))',
        { searchString },
      );
    }
    qb.orderBy('"h"."completionsCount"', 'DESC');
    qb.skip(options.offset).take(options.limit);

    return qb.getManyAndCount();
  }

  async getStatistics(userId: number) {
    return this.query(
      `
      SELECT
        COUNT(*) AS "completionsCount",
        MAX("hc"."createdAt") AS "lastCompleted",
        FLOOR(EXTRACT(minute FROM (NOW() - "h"."createdAt")) / "h"."frequency") AS "requiredCount"
      FROM "habit" "h"
      LEFT JOIN "habit_completion" "hc" ON "hc"."habitId" = "h"."id"
      WHERE "h"."userId" = $1
      GROUP BY "h"."id"
    `,
      [userId],
    );
  }
}
