import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDailyReadUseCase } from './use-cases';
import { RegisterDailyReadDto } from './dtos';

@Controller('streak')
export class StreakController {
  constructor(
    private readonly registerDailyReadUseCase: RegisterDailyReadUseCase,
  ) {}

  @Post()
  async registerRead(@Body() body: RegisterDailyReadDto) {
    try {
      await this.registerDailyReadUseCase.execute(body);
      return;
    } catch (err) {
      console.log(err);
    }
  }
}
