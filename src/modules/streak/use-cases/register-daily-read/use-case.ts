import * as dayjs from 'dayjs';
import { RegisterDailyReadDto } from '../../dtos/register-daily-read.dto';
import {
  makePostRepository,
  makeStreakRepository,
  makeUserRepository,
  PostRepository,
  StreakRepository,
  UserRepository,
} from '../../repositories';
import {
  DailyReadAlreadyExistException,
  NotTodayPostException,
} from '../protocols';
import { WEEKDAYS } from '../constants';

export class RegisterDailyReadUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly streakRepository: StreakRepository,
  ) {}

  async execute(read: RegisterDailyReadDto) {
    if (dayjs().day() === WEEKDAYS.SUNDAY) return;
    const publishedDate = dayjs(read.publishedAt).startOf('day');
    const today = dayjs().startOf('day');

    const isTodayPost = today.isSame(publishedDate);

    if (!isTodayPost) throw new NotTodayPostException();

    const userExists = await this.userRepository.getUserByEmail(read.email);
    const postExists = await this.postRepository.getPostByBeehivId(read.postId);

    const user = userExists
      ? userExists
      : await this.userRepository.createUser(read.email);

    const post = postExists
      ? postExists
      : await this.postRepository.createPost(
          read.postId,
          read.title,
          read.publishedAt,
        );

    const readAlreadyExists =
      await this.streakRepository.findReadByPostAndUserId(user.id, post.id);

    if (readAlreadyExists) throw new DailyReadAlreadyExistException();

    return await this.streakRepository.createRead(user.id, post.id, {
      source: read.utmSource,
      medium: read.utmMedium,
      campaign: read.utmCampaign,
      channel: read.utmChannel || null,
    });
  }
}

export const makeRegisterDailyReadUseCase = () => {
  const userRepository = makeUserRepository();
  const postRepository = makePostRepository();
  const streakRepository = makeStreakRepository();

  return new RegisterDailyReadUseCase(
    userRepository,
    postRepository,
    streakRepository,
  );
};
