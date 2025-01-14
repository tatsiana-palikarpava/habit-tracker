import { Module } from '@nestjs/common';
import { HabitsService } from './services/habits.service';
import { HabitsController } from './controllers/habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { HabitsRepository } from './repositories/habits.repository';
import { HabitCompletion } from './entities/habit-completion.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { HabitsCronJob } from './cron-jobs/habits.cron-jobs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitCompletion]),
    ScheduleModule.forRoot(),
  ],
  controllers: [HabitsController],
  providers: [HabitsService, HabitsRepository, HabitsCronJob],
})
export class HabitsModule {}
