import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { HabitCompletion } from './habit-completion.entity';
import { User } from '../../auth';

@Entity()
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  frequency: number;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column({ default: 0 })
  completionsCount: number;

  @Column({ default: false })
  isNotificationSent: boolean;

  @Column()
  userId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => HabitCompletion, (habitCompletion) => habitCompletion.habit)
  habitCompletions: HabitCompletion[];

  @ManyToOne(() => User, (user) => user.habits)
  user: User;
}
