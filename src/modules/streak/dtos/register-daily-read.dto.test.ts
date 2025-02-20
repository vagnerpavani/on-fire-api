import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { faker } from '@faker-js/faker';
import { RegisterDailyReadDto } from './register-daily-read.dto';
import * as dayjs from 'dayjs';

describe('RegisterDailyReadDto', () => {
  const createValidDTO = () => {
    const today = dayjs();
    const year = today.year().toString().slice(1, 3);
    const postId = `post_${year}-${today.month() + 1}-${dayjs().date()}`;
    console.log('POST_ID: ', postId);
    return {
      email: faker.internet.email(),
      postId: postId,
      title: faker.lorem.sentence(3),
      publishedAt: dayjs().format(),
      utmSource: faker.word.noun(),
      utmMedium: faker.word.noun(),
      utmCampaign: faker.word.noun(),
      utmChannel: faker.word.noun(),
    };
  };

  it('should return no errors for a valid DTO', async () => {
    const validDto = createValidDTO();
    console.log(validDto);
    const dto = plainToInstance(RegisterDailyReadDto, validDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should return no errors for a valid DTO without the optional fields', async () => {
    const validDto = createValidDTO();
    delete validDto.utmCampaign;
    delete validDto.utmChannel;
    delete validDto.utmMedium;
    delete validDto.utmSource;
    const dto = plainToInstance(RegisterDailyReadDto, validDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should return an error if email is not provided', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.email;
    const dto = plainToInstance(RegisterDailyReadDto, invalidDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if email is empty', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.email;
    const dto = plainToInstance(RegisterDailyReadDto, {
      email: '',
      ...invalidDto,
    });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if email is not a valid email', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.email;
    const dto = plainToInstance(RegisterDailyReadDto, {
      email: 'invalid-email',
      ...invalidDto,
    });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if postId is not provided', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.postId;
    const dto = plainToInstance(RegisterDailyReadDto, invalidDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if postId is empty', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.postId;
    const dto = plainToInstance(RegisterDailyReadDto, {
      postId: '',
      ...invalidDto,
    });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if title is not provided', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.title;
    const dto = plainToInstance(RegisterDailyReadDto, invalidDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if title is empty', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.title;
    const dto = plainToInstance(RegisterDailyReadDto, {
      title: '',
      ...invalidDto,
    });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if publishedAt is not provided', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.publishedAt;
    const dto = plainToInstance(RegisterDailyReadDto, invalidDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });

  it('should return an error if title is empty', async () => {
    const invalidDto = createValidDTO();
    delete invalidDto.publishedAt;
    const dto = plainToInstance(RegisterDailyReadDto, {
      publishedAt: '',
      ...invalidDto,
    });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });
});
