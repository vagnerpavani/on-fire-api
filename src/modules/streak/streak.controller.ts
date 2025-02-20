import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { RegisterDailyReadUseCase } from './use-cases';
import { RegisterDailyReadDto } from './dtos';

@Controller('streak')
export class StreakController {
  constructor(
    private readonly registerDailyReadUseCase: RegisterDailyReadUseCase,
  ) {}

  @Post()
  async registerDailyRead(@Body() body: RegisterDailyReadDto) {
    try {
      await this.registerDailyReadUseCase.execute(body);
      return;
    } catch (err) {
      console.log(err);
      return new InternalServerErrorException();
    }
  }
}
