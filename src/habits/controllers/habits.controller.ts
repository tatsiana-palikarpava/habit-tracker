import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto, GetAllHabitsQueryDto, UpdateHabitDto } from '../dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() body: CreateHabitDto) {
    return this.habitsService.create(body);
  }

  @Post(':id/complete')
  @UseInterceptors(ClassSerializerInterceptor)
  trackHabitCompletion(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.trackHabitCompletion(id);
  }

  @Get('all')
  findAll(@Query() query: GetAllHabitsQueryDto) {
    return this.habitsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.findOneOrFail(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateHabitDto) {
    return this.habitsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.remove(id);
  }
}
