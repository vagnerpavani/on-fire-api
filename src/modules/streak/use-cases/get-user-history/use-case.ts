import {
  makePostRepository,
  makeUserRepository,
  PostRepository,
  UserRepository,
} from '../../repositories';
import { UserNotFoundException } from '../protocols';

export class GetUserHistoryUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException();
    const posts =
      await this.postRepository.GetPostsFromUserOrderByMostRecent(userId);

    if (!posts) return [];

    return posts;
  }
}

export const makeGetUserHistoryUseCase = () => {
  const postRepository = makePostRepository();
  const userRepository = makeUserRepository();
  return new GetUserHistoryUseCase(postRepository, userRepository);
};
