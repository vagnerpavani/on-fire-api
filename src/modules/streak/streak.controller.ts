import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  DailyReadAlreadyExistException,
  GetCurrentStreakUseCase,
  GetStreakRankingUseCase,
  GetStreakStatsUseCase,
  NotTodayPostException,
  PostNotFoundException,
  RegisterDailyReadUseCase,
  StreakStatus,
  UpdateStreakLossUseCase,
  UserNotFoundException,
} from './use-cases';
import { RegisterDailyReadDto } from './dtos';
import { Response } from 'express';
import { STREAK_STATUS } from './constants';

@Controller('streak')
export class StreakController {
  constructor(
    private readonly registerDailyReadUseCase: RegisterDailyReadUseCase,
    private readonly getCurrentStreakUseCase: GetCurrentStreakUseCase,
    private readonly getStreakStatsUseCase: GetStreakStatsUseCase,
    private readonly getStreakRankingUseCase: GetStreakRankingUseCase,
    private readonly updateStreakLossUseCase: UpdateStreakLossUseCase,
  ) {}

  @Post()
  async registerDailyRead(
    @Body() body: RegisterDailyReadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await this.registerDailyReadUseCase.execute(body);
      return;
    } catch (err) {
      if (err instanceof DailyReadAlreadyExistException) {
        res.status(HttpStatus.OK);
        return;
      }
      if (err instanceof NotTodayPostException) {
        res.status(HttpStatus.FORBIDDEN);
        return;
      }
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  @Get('user/:userId')
  async getCurrentStreak(@Param() params: { userId: string }) {
    try {
      return await this.getCurrentStreakUseCase.execute(params.userId);
    } catch (err) {
      if (err instanceof UserNotFoundException) throw new NotFoundException();
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Get('stats')
  async getStreakStats(
    @Query()
    params: {
      startAt: string;
      endAt: string;
      postId: string;
      streakStatus: string;
    },
  ) {
    try {
      const streakStatuses = {
        streak: STREAK_STATUS.STREAK,
        noStreak: STREAK_STATUS.NO_STREAK,
      };
      const streakStatus: StreakStatus = streakStatuses[params.streakStatus]
        ? streakStatuses[params.streakStatus]
        : null;

      console.log(params);
      return await this.getStreakStatsUseCase.execute(
        params.startAt,
        params.endAt,
        params.postId,
        streakStatus,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Get('ranking')
  async getStreakRanking(
    @Query()
    params: {
      startAt: string;
      endAt: string;
      postId: string;
      streakStatus: string;
    },
  ) {
    try {
      const streakStatuses = {
        streak: STREAK_STATUS.STREAK,
        noStreak: STREAK_STATUS.NO_STREAK,
      };
      const streakStatus: StreakStatus = streakStatuses[params.streakStatus]
        ? streakStatuses[params.streakStatus]
        : null;
      return await this.getStreakRankingUseCase.execute();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Post('job/update-streaks')
  async updateStreaks() {
    try {
      return await this.updateStreakLossUseCase.execute();
    } catch (err) {
      if (err instanceof PostNotFoundException) {
        throw new NotFoundException('Post not found!');
      }
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
