import { makeUserRepository, UserRepository } from '../../repositories';

export class GetStreakRankingUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(startAt?: string, endAt?: string, postId?: string) {
    const usersCurrentStreakRanking = await this.userRepository.getUserRanking(
      'currentStreak',
      postId,
      startAt,
      endAt,
    );

    const currentStreakRanking = usersCurrentStreakRanking.map((user, i) => {
      return { position: i + 1, ...user };
    });

    const usersRecordStreakRanking = await this.userRepository.getUserRanking(
      'recordStreak',
      postId,
      startAt,
      endAt,
    );
    const recordStreakRanking = usersRecordStreakRanking.map((user, i) => {
      return { position: i + 1, ...user };
    });

    return {
      currentStreakRanking,
      recordStreakRanking,
    };
  }
}

export const makeGetStreakRankingUseCase = () => {
  const userRepository = makeUserRepository();

  return new GetStreakRankingUseCase(userRepository);
};
