import { Module } from '@nestjs/common';
import {
  makeRegisterDailyReadUseCase,
  RegisterDailyReadUseCase,
} from './use-cases';
import { StreakController } from './streak.controller';

@Module({
  imports: [],
  controllers: [StreakController],
  providers: [
    {
      provide: RegisterDailyReadUseCase,
      useFactory: makeRegisterDailyReadUseCase,
    },
  ],
})
export class StreakModule {}
