import { Module } from '@nestjs/common';
import { HabitsService } from './services/habits.service';
import { HabitsController } from './controllers/habits.controller';
import { HabitsValidationService } from './services/habits-validation.service';
// import mockHabitsValidationService, { MockHabitsValidationService } from './services/mock-habits-validation.service';
import { DBConnectionOptions } from './connections/db.connection.options';
import { DBConnection } from './connections/db.connection';
import mockHabitsValidationService, {
  MockHabitsValidationService,
} from './services/mock-habits-validation.service';
@Module({
  controllers: [HabitsController],
  providers: [
    HabitsService,
    // {
    //   provide: HabitsValidationService,
    //   useValue: mockHabitsValidationService,
    // },
    HabitsValidationService,
    // {
    //   provide: HabitsValidationService,
    //   useClass: MockHabitsValidationService,
    // },
    // {
    //   provide: 'VALIDATION',
    //   useClass: MockHabitsValidationService,
    // },
    // DBConnectionOptions,
    // {
    //   provide: 'CONNECTION',
    //   useFactory: (optionsProvider: DBConnectionOptions) => {
    //     const options = optionsProvider.get();
    //     return new DBConnection(options);
    //   },
    //   inject: [DBConnectionOptions],
    // }
  ],
})
export class HabitsModule {}
