import {
  makeStreakRepository,
  makeUserRepository,
  StreakRepository,
  UserRepository,
} from '../../repositories';
import * as dayjs from 'dayjs';
import { UserNotFoundException } from '../protocols';
import { WEEKDAYS } from '../constants';

export class GetCurrentStreakUseCase {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const userWithReads =
      await this.streakRepository.getReadsFromUserOrderByCreationDesc(userId);
    if (!userWithReads) throw new UserNotFoundException();

    const user = userWithReads.user;
    const reads = userWithReads.reads;
    let currentStreak = 1;
    let index = 0;

    if (dayjs().day() == WEEKDAYS.SUNDAY)
      return { currentStreak: user.currentStreak, user };

    do {
      if (index + 1 >= reads.length) break;

      const currentReadDate = reads[index].createdAt;
      const isMonday = dayjs(currentReadDate).day() === WEEKDAYS.MONDAY;
      const expectedPrevDate = isMonday
        ? dayjs(currentReadDate).subtract(2, 'day')
        : dayjs(currentReadDate).subtract(1, 'day');
      const prevDayReadDate = reads[index + 1].createdAt;

      if (
        dayjs(prevDayReadDate).format('DD/MM/YYYY') !==
        dayjs(expectedPrevDate).format('DD/MM/YYYY')
      )
        break;

      currentStreak++;
      index++;
    } while (index < reads.length);

    user.recordStreak =
      currentStreak <= user.recordStreak ? user.recordStreak : currentStreak;

    user.currentStreak = currentStreak;
    await this.userRepository.updateUser(user);
    return { currentStreak, user };
  }
}

export const makeGetCurrentStreakUseCase = () => {
  const streakRepository = makeStreakRepository();
  const userRepository = makeUserRepository();

  return new GetCurrentStreakUseCase(streakRepository, userRepository);
};
