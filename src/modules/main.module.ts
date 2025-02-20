import { Module } from '@nestjs/common';
import { StreakModule } from './streak/streak.module';

@Module({
  imports: [StreakModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
