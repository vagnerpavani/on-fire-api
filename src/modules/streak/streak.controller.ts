import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  DailyReadAlreadyExistException,
  GetCurrentStreakUseCase,
  NotTodayPostException,
  RegisterDailyReadUseCase,
  UserNotFoundException,
} from './use-cases';
import { RegisterDailyReadDto } from './dtos';
import { Response } from 'express';

@Controller('streak')
export class StreakController {
  constructor(
    private readonly registerDailyReadUseCase: RegisterDailyReadUseCase,
    private readonly getCurrentStreakUseCase: GetCurrentStreakUseCase,
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

  @Get(':userId')
  async getCurrentStreak(@Param() params: { userId: string }) {
    try {
      return await this.getCurrentStreakUseCase.execute(params.userId);
    } catch (err) {
      if (err instanceof UserNotFoundException) throw new NotFoundException();
      console.log('LOGANDO', err);
      throw new InternalServerErrorException();
    }
  }
}
