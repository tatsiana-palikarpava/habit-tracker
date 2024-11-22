import { UUID } from 'crypto';

export class Habit {
  public id: UUID;
  public title: string;
  public description: string;
  public frequency: number; // in minutes
  public deadline: Date;
}
