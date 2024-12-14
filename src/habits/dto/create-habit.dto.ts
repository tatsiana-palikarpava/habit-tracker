import { OmitType } from '@nestjs/mapped-types';
import { Habit } from '../entities/habit.entity';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({ type: String })
  @IsString()
  public title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String })
  public description: string;

  @IsNumber()
  @ApiProperty({ type: Number })
  public frequency: number; // in minutes

  @IsDateString()
  @ApiProperty({ type: Date })
  public deadline: Date;
}
