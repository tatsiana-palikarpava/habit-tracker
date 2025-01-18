import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllHabitsQueryDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  offset: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  limit: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  search?: string;
}
