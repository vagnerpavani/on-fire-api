import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GetUserHistoryUseCase, UserNotFoundException } from './use-cases';

@Controller('user')
export class UserController {
  constructor(private readonly getUserHistoryUseCase: GetUserHistoryUseCase) {}

  @Get(':userId/posts')
  async getUserHistory(@Param() params: { userId: string }) {
    try {
      return await this.getUserHistoryUseCase.execute(params.userId);
    } catch (err) {
      if (err instanceof UserNotFoundException) throw new NotFoundException();
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
