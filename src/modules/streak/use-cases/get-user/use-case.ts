import { makeUserRepository, UserRepository } from '../../repositories';
import { UserNotFoundException } from '../protocols';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) throw new UserNotFoundException();

    return user;
  }
}

export const makeGetUserUseCase = () => {
  const userRepository = makeUserRepository();

  return new GetUserUseCase(userRepository);
};
