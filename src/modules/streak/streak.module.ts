import { Module } from '@nestjs/common';
import {
  GetCurrentStreakUseCase,
  makeGetCurrentStreakUseCase,
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
    {
      provide: GetCurrentStreakUseCase,
      useFactory: makeGetCurrentStreakUseCase,
    },
  ],
})
export class StreakModule {}
