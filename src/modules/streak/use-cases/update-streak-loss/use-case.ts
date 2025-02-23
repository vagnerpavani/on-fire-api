import * as dayjs from 'dayjs';
import {
  makePostRepository,
  makeStreakRepository,
  PostRepository,
  StreakRepository,
} from '../../repositories';
import { PostNotFoundException } from '../protocols';

export class UpdateStreakLossUseCase {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async execute() {
    const startAt = dayjs().subtract(1, 'day').format();
    const endAt = dayjs().add(1, 'day').format();
    const todayPost = await this.postRepository.getPostByPublishDateRange(
      startAt,
      endAt,
    );

    if (!todayPost) throw new PostNotFoundException();

    await this.streakRepository.resetStreak(todayPost.id);
  }
}

export const makeUpdateStreakLossUseCase = () => {
  const streakRepository = makeStreakRepository();
  const postRepository = makePostRepository();

  return new UpdateStreakLossUseCase(streakRepository, postRepository);
};
