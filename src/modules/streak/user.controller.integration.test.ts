import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import TestAgent from 'supertest/lib/agent';
import { UserRepository } from './repositories';
import { cleanDatabase, createFakeStreak, createFakeUser } from '__tests__/db';
import { createApp } from 'src/app';

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

describe('GET /user/:userId/posts', () => {
  const path = (userId: string) => `/user/${userId}/posts`;

  describe('error cases', () => {
    it(`should respond with status ${HttpStatus.NOT_FOUND} when the user does not exist`, async () => {
      const res = await server.get(path('0')).send();

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });

    it(`should respond with status ${HttpStatus.INTERNAL_SERVER_ERROR} when an unexpected error occours`, async () => {
      const spy = jest.spyOn(UserRepository.prototype, 'getUserById');
      spy.mockImplementationOnce(() => {
        throw Error('DATABASE ERROR MOCK');
      });

      const res = await server.get(path('0')).send();

      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('success cases', () => {
    it(`should respond with status ${HttpStatus.OK} when an valid user Id is sent`, async () => {
      const userWithStreak = await createFakeStreak();
      const res = await server.get(path(userWithStreak.id)).send();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.length).toBe(3);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            publishedAt: expect.any(String),
            beehivId: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });

    it(`should respond with status ${HttpStatus.OK} when an valid user Id is sent but has no reads`, async () => {
      const user = await createFakeUser();

      const res = await server.get(path(user.id)).send();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual([]);
    });
  });
});
