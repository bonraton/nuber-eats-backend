import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const dataSource = new DataSource({
  type: 'postgres',
  database: 'nuber-eats-test',
});

const GRAPHQL_ENDPOINT = '/graphql';
const EMAIL = 'olegJonas@rambler.ru';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dataSource.initialize();
    await dataSource.dropDatabase();
    app.close;
  });

  describe('createAccount', () => {
    it('should create account', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          createAccount(input: {
            email: "biba@biba.ru",
            password: "1234567",
            role: Client
          })
          {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
    it('should fail if account exists', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
      mutation {
        createAccount(input: {
          email: "biba@biba.ru",
          password: "1234567",
          role: Client
        })
        {
          ok
          error
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  it.todo('createAccount');
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
