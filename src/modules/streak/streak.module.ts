import { Module } from '@nestjs/common';
import {
  GetCurrentStreakUseCase,
  GetStreakRankingUseCase,
  GetStreakStatsUseCase,
  GetUserHistoryUseCase,
  GetUserUseCase,
  makeGetCurrentStreakUseCase,
  makeGetStreakRankingUseCase,
  makeGetStreakStatsUseCase,
  makeGetUserHistoryUseCase,
  makeGetUserUseCase,
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
    {
      provide: GetUserUseCase,
      useFactory: makeGetUserUseCase,
    },
    {
      provide: GetStreakStatsUseCase,
      useFactory: makeGetStreakStatsUseCase,
    },
    {
      provide: GetStreakRankingUseCase,
      useFactory: makeGetStreakRankingUseCase,
    },
  ],
})
export class StreakModule {}
