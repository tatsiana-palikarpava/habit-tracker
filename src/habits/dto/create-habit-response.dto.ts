import { Exclude, Expose } from 'class-transformer';
import { Habit } from '../entities/habit.entity';

export class CreateHabitResponseDto extends Habit {
  @Exclude()
  public description: string;

  @Expose()
  get freqStr() {
    return `${this.frequency} minute(s)`;
  }

  constructor(partial: Partial<Habit>) {
    super();
    Object.assign(this, partial);
  }
}
