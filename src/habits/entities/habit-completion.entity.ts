import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Habit } from './habit.entity';

@Entity('habit_completion')
export class HabitCompletion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  habitId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Habit, (habit) => habit.habitCompletions)
  habit: Habit;
}
