import {
  makeStreakRepository,
  makeUserRepository,
  StreakRepository,
  UserRepository,
} from '../../repositories';

export class GetStreakStatsUseCase {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(startAt?: string, endAt?: string, postId?: string) {
    const posts = await this.streakRepository.getAllReadsWithUserAndPost(
      startAt,
      endAt,
      postId,
    );

    const totalUsers = await this.userRepository.getTotalUsers();

    const peopleWithStreak = posts.map((post) => {
      const userWithStreak = post.users.filter((user) => {
        return user.currentStreak > 1;
      });

      const userWithNoStreak = post.users.filter((user) => {
        return user.currentStreak < 1;
      });

      return {
        postId: post.id,
        title: post.title,
        publishedAt: post.publishedAt,
        userWithStreak: userWithStreak.length,
        userWithNoStreak: userWithNoStreak.length,
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

    return {
      posts,
      totalUsers,
      peopleWithStreak,
      postRecords,
      userStreakLoss,
    };
  }
}

export const makeGetStreakStatsUseCase = () => {
  const streakRepository = makeStreakRepository();
  const userRepository = makeUserRepository();

  return new GetStreakStatsUseCase(streakRepository, userRepository);
};
