import { STREAK_STATUS } from '../../constants';
import {
  makeStreakRepository,
  makeUserRepository,
  StreakRepository,
  UserRepository,
} from '../../repositories';
import { StreakStatus } from '../protocols';

export class GetStreakStatsUseCase {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    startAt?: string,
    endAt?: string,
    postId?: string,
    streakStatus?: StreakStatus,
  ) {
    const posts = await this.streakRepository.getAllReadsWithUserAndPost(
      startAt,
      endAt,
      postId,
      streakStatus,
    );

    const totalUsers = await this.userRepository.getTotalUsers(streakStatus);

    const peopleWithStreak = posts.map((post) => {
      const userWithStreak = post.users.filter((user) => {
        return user.currentStreak > 1;
      });

      const userWithNoStreak = post.users.filter((user) => {
        return user.currentStreak <= 1;
      });

      return {
        postId: post.id,
        title: post.title,
        publishedAt: post.publishedAt,
        userWithStreak:
          streakStatus === STREAK_STATUS.NO_STREAK ? 0 : userWithStreak.length,
        userWithNoStreak:
          streakStatus === STREAK_STATUS.STREAK ? 0 : userWithNoStreak.length,
      };
    });

    const postRecords = posts.map((post) => {
      const userHighestCurrentStreak = post.users.reduce((prev, curr) => {
        return prev.currentStreak > curr.currentStreak ? prev : curr;
      });

      return {
        postId: post.id,
        title: post.title,
        publishedAt: post.publishedAt,
        highestStreak: userHighestCurrentStreak.currentStreak,
      };
    });

    const userStreakLoss = posts.map((post) => {
      const streakLoss = totalUsers - post.users.length;

      return {
        postId: post.id,
        title: post.title,
        publishedAt: post.publishedAt,
        streakLoss,
      };
    });

    const trafficStats = await this.streakRepository.getStreakUtmStats(
      startAt,
      endAt,
      postId,
    );

    return {
      posts,
      totalUsers,
      peopleWithStreak,
      postRecords,
      userStreakLoss,
      ...trafficStats,
    };
  }
}

export const makeGetStreakStatsUseCase = () => {
  const streakRepository = makeStreakRepository();
  const userRepository = makeUserRepository();

  return new GetStreakStatsUseCase(streakRepository, userRepository);
};
