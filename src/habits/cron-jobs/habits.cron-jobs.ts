import { Injectable } from '@nestjs/common';
import { HabitsRepository } from '../repositories/habits.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { In } from 'typeorm';
import { Transporter, createTransport } from 'nodemailer';
import configuration from 'config/configuration';

@Injectable()
export class HabitsCronJob {
  private transporter: Transporter;
  constructor(private habitsRepository: HabitsRepository) {
    this.transporter = createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: configuration().email.sender,
        pass: configuration().email.password,
      },
    });
  }

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
            "h"."title",
            "h"."userId",
            "u"."email"
            FROM "habit" "h"
            LEFT JOIN "habit_completion" "hc" ON "hc"."habitId" = "h"."id"
            LEFT JOIN "user" "u" ON "u"."id" = "h"."userId"
            WHERE "h"."isNotificationSent" = FALSE
            GROUP BY "h"."id", "u"."email"
        ) "completion_info"
        WHERE completion_info."minutesPassedSinceLastCompleted" > completion_info.frequency
      `);
      for (const habit of habitsMissingNotification) {
        console.log(
          `Sending a reminder to user ${habit.userId} about habit ${habit.habitId}`,
        );
        console.log(habit.email);
        const info = await this.transporter.sendMail({
          from: configuration().email.sender,
          to: habit.email,
          subject: "Don't forget about your habit! ✔",
          text: `Your habit "${habit.title}" is waiting for completion`,
          html: `<p>Your habit <b>${habit.title}</b> is waiting for completion</p>`,
        });
        console.log(info);
      }
      await this.habitsRepository.update(
        { id: In(habitsMissingNotification.map(({ habitId }) => habitId)) },
        { isNotificationSent: true },
      );
      console.log('Cron job finished successfully');
    } catch (err) {
      console.log('Cron job failed. Reason:', err.message || err);
    } finally {
      this.isCronRunning = false;
    }
  }
}
