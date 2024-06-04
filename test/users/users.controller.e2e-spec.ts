import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../src/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as request from 'supertest';

describe('UsersController with db (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepo = app.get(getRepositoryToken(UserEntity));

    const user = UserEntity.create('test@test.es');
    user.uid = '1234-5678';
    await userRepo.insert(user);
  });

  describe('/users (GET)', () => {
    it('should get current users', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([
          {
            uid: '1234-5678',
            email: 'test@test.es',
          },
        ]);
    });
  });

  afterEach(() => {
    userRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });
});
