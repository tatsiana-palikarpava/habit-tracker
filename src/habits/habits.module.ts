import { Module } from '@nestjs/common';
import { HabitsService } from './services/habits.service';
import { HabitsController } from './controllers/habits.controller';
@Module({
  controllers: [HabitsController],
  providers: [HabitsService],
})
export class HabitsModule {}
