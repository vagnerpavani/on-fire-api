import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import TestAgent from 'supertest/lib/agent';
import { UserRepository } from './repositories';
import {
  cleanDatabase,
  createFakePost,
  createFakeRead,
  createFakeUser,
} from '__tests__/db';
import { createApp } from 'src/app';
import { faker } from '@faker-js/faker/.';
import * as dayjs from 'dayjs';

let server: TestAgent = null;
let app: INestApplication;

beforeAll(async () => {
  app = await createApp();
  await app.init();

  server = request(app.getHttpServer());
});

afterAll(async () => {
  await cleanDatabase();
  await app.close();
});

beforeEach(async () => {
  await cleanDatabase();
  jest.clearAllMocks();
});

describe('POST /streak', () => {
  const createValidBody = () => {
    const today = dayjs();
    const year = today.year().toString().slice(1, 3);
    const postId = `post_${year}-${today.month() + 1}-${dayjs().date()}`;
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

  const path = '/streak';

  describe('error cases', () => {
    it(`should respond with status ${HttpStatus.BAD_REQUEST} with invalid body`, async () => {
      const res = await server.post(path).send({ 'invalid-data': 'invalid' });

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`should respond with status ${HttpStatus.FORBIDDEN} when post is not from current day`, async () => {
      const body = createValidBody();
      body.publishedAt = dayjs().subtract(1, 'day').format();
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it(`should respond with status ${HttpStatus.INTERNAL_SERVER_ERROR} when an unexpected error occours`, async () => {
      const spy = jest.spyOn(UserRepository.prototype, 'getUserByEmail');
      spy.mockImplementationOnce(() => {
        throw Error('DATABASE ERROR MOCK');
      });
      const body = createValidBody();
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('success cases', () => {
    it(`should respond with status ${HttpStatus.CREATED} when an valid body is sent`, async () => {
      const body = createValidBody();
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it(`should respond with status ${HttpStatus.CREATED} when an valid body is sent and the user already exists`, async () => {
      const body = createValidBody();
      const user = await createFakeUser();
      body.email = user.email;
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it(`should respond with status ${HttpStatus.CREATED} when an valid body is sent and the post already exists`, async () => {
      const body = createValidBody();
      const post = await createFakePost();
      body.postId = post.id.toString();
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it(`should respond with status ${HttpStatus.CREATED} when an valid body is sent and the user and post already exists`, async () => {
      const body = createValidBody();
      const user = await createFakeUser();
      const post = await createFakePost();
      body.email = user.email;
      body.postId = post.id.toString();
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it(`should respond with status ${HttpStatus.OK} when an valid body is sent and the read was already registered`, async () => {
      const body = createValidBody();
      const user = await createFakeUser();
      const post = await createFakePost();
      await createFakeRead({ user, post });
      body.email = user.email;
      body.postId = post.beehivId;
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.OK);
    });

    it(`should respond with status ${HttpStatus.OK} when an valid body is sent and the read was already registered`, async () => {
      const body = createValidBody();
      const user = await createFakeUser();
      const post = await createFakePost();
      await createFakeRead({ user, post });
      body.email = user.email;
      body.postId = post.beehivId;
      const res = await server.post(path).send(body);

      expect(res.status).toBe(HttpStatus.OK);
    });
  });
});
