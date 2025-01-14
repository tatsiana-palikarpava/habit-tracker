import { Injectable } from '@nestjs/common';
import { HabitsRepository } from '../repositories/habits.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HabitsCronJob {
  constructor(private habitsRepository: HabitsRepository) {}

  private isCronRunning = false;

  @Cron(CronExpression.EVERY_10_SECONDS)
  private async sendHabitsReminders() {
    if (this.isCronRunning) {
      console.log('Cron is already running');
      return;
    }
    console.log('Starting cron job sending habits reminders');
    this.isCronRunning = true;
    try {
      const habitsMissingNotification = await this.habitsRepository.query(`
        SELECT * FROM (
            SELECT EXTRACT(EPOCH FROM (NOW() - MAX("hc"."createdAt"))) / 60 AS "minutesPassedSinceLastCompleted",
            "h"."id" AS "habitId",
            "h"."frequency",
            "h"."userId"
            FROM "habit" "h"
            LEFT JOIN "habit_completion" "hc" ON "hc"."habitId" = "h"."id"
            GROUP BY "h"."id"
        ) "completion_info"
        WHERE completion_info."minutesPassedSinceLastCompleted" > completion_info.frequency
      `);
      for (const habit of habitsMissingNotification) {
        console.log(
          `Sending a reminder to user ${habit.userId} about habit ${habit.habitId}`,
        );
      }
      console.log('Cron job finished successfully');
    } catch (err) {
      console.log('Cron job failed. Reason:', err.message || err);
    } finally {
      this.isCronRunning = false;
    }
  }
}
