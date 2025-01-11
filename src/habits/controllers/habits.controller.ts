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
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser, AuthUserType } from 'src/auth';

@Controller('habits')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(@Body() body: CreateHabitDto, @AuthUser() user: AuthUserType) {
    return new CreateHabitResponseDto(
      await this.habitsService.create(body, user.sub),
    );
  }

  @Post(':id/complete')
  trackHabitCompletion(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.trackHabitCompletion(id, user.sub);
  }

  @Get('all')
  findAll(
    @Query() query: GetAllHabitsQueryDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.findAll(query, user.sub);
  }

  @Get('stats')
  getStatistics(@AuthUser() user: AuthUserType) {
    return this.habitsService.getStatistics(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.findOneOrFail(id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHabitDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.update(id, body, user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserType,
  ) {
    return this.habitsService.remove(id, user.sub);
  }
}
