import { makeUserRepository, UserRepository } from '../../repositories';

export class GetStreakRankingUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute() {
    const usersCurrentStreakRanking =
      await this.userRepository.getUserRanking('currentStreak');

    const currentStreakRanking = usersCurrentStreakRanking.map((user, i) => {
      return { position: i + 1, ...user };
    });

    const usersRecordStreakRanking =
      await this.userRepository.getUserRanking('recordStreak');
    const recordStreakRanking = usersCurrentStreakRanking.map((user, i) => {
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
