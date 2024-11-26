import { OmitType } from '@nestjs/mapped-types';
import { Habit } from '../entities/habit.entity';

export class CreateHabitDto extends OmitType(Habit, ['id']) {}
