import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto, GetAllHabitsQueryDto, UpdateHabitDto } from '../dto';
import { CreateHabitResponseDto } from '../dto/create-habit-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser, AuthUserType } from 'src/auth';
import { JwtAuthGuard } from 'src/auth';

@Controller('habits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(@Body() body: CreateHabitDto, @AuthUser() user: AuthUserType) {
    return new CreateHabitResponseDto(
      await this.habitsService.create(body, user.userId),
    );
  }

  @Post(':id/complete')
  trackHabitCompletion(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.trackHabitCompletion(id, user.userId);
  }

  @Get('all')
  findAll(
    @Query() query: GetAllHabitsQueryDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.findAll(query, user.userId);
  }

  @Get('stats')
  getStatistics(@AuthUser() user: AuthUserType) {
    return this.habitsService.getStatistics(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.findOneOrFail(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHabitDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.update(id, body, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.remove(id, user.userId);
  }
}
