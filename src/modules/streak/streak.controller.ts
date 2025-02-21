import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import {
  DailyReadAlreadyExistException,
  NotTodayPostException,
  RegisterDailyReadUseCase,
} from './use-cases';
import { RegisterDailyReadDto } from './dtos';
import { Response } from 'express';

@Controller('streak')
export class StreakController {
  constructor(
    private readonly registerDailyReadUseCase: RegisterDailyReadUseCase,
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
}
