import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  SetMetadata,
  ParseUUIDPipe,
  HttpStatus,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto, UpdateHabitDto } from '../dto';
import { UUID } from 'crypto';
import { HttpExceptionFilter, Origin } from '@libs/utils';
import { OriginGuard } from '@libs/utils';
import { ToUpperCasePipe } from '@libs/utils/pipes/to-upper-case.pipe';
import { ZodValidationPipe } from '@libs/utils/pipes/zod-validation.pipe';
import { createHabitSchema } from '../schemas';
import { LoggingInterceptor } from '@libs/utils';
import { ALLOWED_ORIGINS } from '../constants';
import { CreateHabitResponseDto } from '../dto/create-habit-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  // @UsePipes(new ZodValidationPipe(createHabitSchema))
  create(
    @Body(new ToUpperCasePipe('title')) createHabitDto: CreateHabitDto,
  ): CreateHabitResponseDto {
    return new CreateHabitResponseDto(
      this.habitsService.create(createHabitDto),
    );
  }

  @Get('all')
  @UseFilters(new HttpExceptionFilter())
  // @SetMetadata('origins', ALLOWED_ORIGINS)
  @UseGuards(OriginGuard)
  @Origin(ALLOWED_ORIGINS)
  findAll() {
    return this.habitsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: UUID,
  ) {
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
