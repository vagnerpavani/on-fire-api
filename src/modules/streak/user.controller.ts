import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  GetUserHistoryUseCase,
  GetUserUseCase,
  UserNotFoundException,
} from './use-cases';

@Controller('user')
export class UserController {
  constructor(
    private readonly getUserHistoryUseCase: GetUserHistoryUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

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

  @Get()
  async getUser(@Query('email') email: string) {
    try {
      return await this.getUserUseCase.execute(email);
    } catch (err) {
      if (err instanceof UserNotFoundException) throw new NotFoundException();
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
