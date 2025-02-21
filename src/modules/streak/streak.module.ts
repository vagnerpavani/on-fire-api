import { Module } from '@nestjs/common';
import {
  GetCurrentStreakUseCase,
  GetUserHistoryUseCase,
  makeGetCurrentStreakUseCase,
  makeGetUserHistoryUseCase,
  makeRegisterDailyReadUseCase,
  RegisterDailyReadUseCase,
} from './use-cases';
import { StreakController } from './streak.controller';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [StreakController, UserController],
  providers: [
    {
      provide: RegisterDailyReadUseCase,
      useFactory: makeRegisterDailyReadUseCase,
    },
    {
      provide: GetCurrentStreakUseCase,
      useFactory: makeGetCurrentStreakUseCase,
    },
    {
      provide: GetUserHistoryUseCase,
      useFactory: makeGetUserHistoryUseCase,
    },
  ],
})
export class StreakModule {}
