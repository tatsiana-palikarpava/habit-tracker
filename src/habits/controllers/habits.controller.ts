import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto, UpdateHabitDto } from '../dto';
import { UUID } from 'crypto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
  }

  @Get('all')
  findAll() {
    return this.habitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.habitsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(id, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.habitsService.remove(id);
  }
}
