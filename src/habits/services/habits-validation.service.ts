import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { IHabitsValidationService } from './habits-validation.interface';
import { HabitsService } from './habits.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class HabitsValidationService implements IHabitsValidationService {
  // private habitsService;
  constructor(
    // private moduleRef: ModuleRef,
    // @Inject(forwardRef(() => HabitsService))
    private readonly habitsService: HabitsService,
  ) {}

  // onModuleInit() {
  //   this.habitsService = this.moduleRef.get(HabitsService);
  // }

  validate(): void {
    // console.log(this.habitsService.findAll())
    console.log('all good!');
  }
}
