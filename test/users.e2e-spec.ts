import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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
const EMAIL = 'biba@biba.ru';
const PASSWORD = '12345';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
            email: "${EMAIL}",
            password: "${PASSWORD}",
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
          email: "${EMAIL}",
          password: "${PASSWORD}",
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

  describe('login', () => {
    it('should login with correct credentials', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation{
          login(input:{
            email: "${EMAIL}"
            password: "${PASSWORD}"
          })
          {
            ok
            error
            token
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          token = login.token;
        });
    });
    it('should not be able to login with correct credentials', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation{
          login(input:{
            email: "${EMAIL}"
            password: "xxx"
          })
          {
            ok
            error
            token
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong password');
          expect(login.token).toBe(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const user = await usersRepository.findOne({ where: { id: 1 } });
      userId = user.id;
    });
    it('should see a user profile', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, token)
        .send({
          query: `{ 
            userProfile(userId: ${userId}){
              ok
              error
              user {
                id
              }
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });
    it('should not see a user profile', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set(`X-JWT`, token)
        .send({
          query: `{ 
            userProfile(userId: 999){
              ok
              error
              user {
                id
              }
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
          expect(user).toBe(null);
        });
    });
  });
  describe('me', () => {
    it('should find my profile', async () => {
      return await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set({ 'X-JWT': token })
        .send({
          query: `
          {
            me {
              email
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body);
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toEqual(EMAIL);
        });
    });
  });
  it('should not allow logget out user', async () => {
    return await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: `
          {
            me {
              email
            }
          }`,
      })
      .expect(200)
      .expect((res) => {
        const {
          body: { errors },
        } = res;
        const [error] = errors;
        expect(error.message).toBe('Forbidden resource');
      });
  });
  it.todo('verifyEmail');
  it.todo('editProfile');
});
