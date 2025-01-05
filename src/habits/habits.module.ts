import { Module } from '@nestjs/common';
import { HabitsService } from './services/habits.service';
import { HabitsController } from './controllers/habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { HabitsRepository } from './repositories/habits.repository';
import { HabitCompletion } from './entities/habit-completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitCompletion])],
  controllers: [HabitsController],
  providers: [HabitsService, HabitsRepository],
})
export class HabitsModule {}
