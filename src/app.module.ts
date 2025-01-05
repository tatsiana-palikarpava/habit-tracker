import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitsModule } from './habits/habits.module';
import { LoggerMiddleware } from '@libs/utils';
import { HabitsController } from './habits/controllers/habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Habit } from './habits/entities/habit.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    HabitsModule,
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...configuration().database,
      // entities: [Habit],
      logging: true, 
      autoLoadEntities: true,
      synchronize: true, // unsafe
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(HabitsController);
  }
}
