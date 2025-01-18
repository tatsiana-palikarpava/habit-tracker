import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitsModule } from './habits/habits.module';
import { LoggerMiddleware } from '@libs/utils';
import { HabitsController } from './habits/controllers/habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HabitsModule,
    ConfigModule.forRoot({ load: [configuration] }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...configuration().database,
      // entities: [Habit],
      autoLoadEntities: true,
      synchronize: true, // unsafe
    }),
    JwtModule.register({
      global: true,
      secret: configuration().auth.jwtSecret,
      signOptions: { expiresIn: configuration().auth.accessTokenExpires },
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
