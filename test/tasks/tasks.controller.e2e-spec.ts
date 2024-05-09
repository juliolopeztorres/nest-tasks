import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateTaskRequest } from '../../src/tasks/requests/create-task.request';
import { UpdateTaskRequest } from '../../src/tasks/requests/update-task.request';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('/tasks (GET)', () => {
    it('gets current tasks', async () => {
      await request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
    });
  });

  describe('/tasks (POST)', () => {
    it('can create new task', async () => {
      const req: CreateTaskRequest = {
        description: 'my new task',
      };

      await request(app.getHttpServer()).post('/tasks').send(req).expect(201);
      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect([{ id: 1, description: 'my new task' }]);
    });

    it('fails to create duplicated task', async () => {
      const req: CreateTaskRequest = {
        description: 'my new task',
      };

      await request(app.getHttpServer()).post('/tasks').send(req).expect(201);
      await request(app.getHttpServer()).post('/tasks').send(req).expect(400);
    });

    test.each`
      message | req | res
      ${'blank request'} | ${{}} | ${{
  message: ['description must be a string', 'description should not be empty'],
  error: 'Bad Request',
  statusCode: 400,
}}
      ${'description wrong type'} | ${{ description: 18 }} | ${{
  message: ['description must be a string'],
  error: 'Bad Request',
  statusCode: 400,
}}
    `('fails with $message', async ({ req, res }) => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send(req)
        .expect(400)
        .expect(res);
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('can edit existing task', async () => {
      const createReq: CreateTaskRequest = {
        description: 'my new task',
      };

      const req: UpdateTaskRequest = {
        id: 1,
        description: 'my brand new description',
      };
      await request(app.getHttpServer())
        .post('/tasks')
        .send(createReq)
        .expect(201);
      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect([{ id: 1, description: 'my new task' }]);
      await request(app.getHttpServer())
        .put(`/tasks/${1}`)
        .send(req)
        .expect(204);
      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect([{ id: 1, description: 'my brand new description' }]);
    });

    test.each`
      message | id | req | res | resCode
      ${'wrong id type and valid request'} | ${'-18'} | ${{
  id: 18,
  description: 'my description',
}} | ${{ statusCode: 400, message: 'Invalid positive number entered -18' }} | ${400}
      ${'non existing id and valid request'} | ${18} | ${{
  id: 18,
  description: 'my description',
}} | ${{ statusCode: 404, message: 'Invalid id 18 supplied' }} | ${404}
      ${'valid id and blank request'} | ${18} | ${{}} | ${{
  message: ['id must be a number conforming to the specified constraints', 'id should not be empty', 'description must be a string', 'description should not be empty'],
  error: 'Bad Request',
  statusCode: 400,
}} | ${400}
      ${'valid id and request with wrong body id type'} | ${18} | ${{
  id: '18',
  description: 'my description',
}} | ${{
  message: ['id must be a number conforming to the specified constraints'],
  error: 'Bad Request',
  statusCode: 400,
}} | ${400}
      ${'valid id and request with wrong body description type'} | ${18} | ${{
  id: 18,
  description: 24,
}} | ${{
  message: ['description must be a string'],
  error: 'Bad Request',
  statusCode: 400,
}} | ${400}
    `('fails with $message', async ({ id, req, res, resCode }) => {
      await request(app.getHttpServer())
        .put(`/tasks/${id}`)
        .send(req)
        .expect(resCode)
        .expect(res);
    });

    it('should fail with `id` content mismatching', async () => {
      const createReq: CreateTaskRequest = {
        description: 'my new task',
      };

      const req: UpdateTaskRequest = {
        id: 18,
        description: 'my description',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createReq)
        .expect(201);
      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect([{ id: 1, description: 'my new task' }]);
      await request(app.getHttpServer())
        .put(`/tasks/${1}`)
        .send(req)
        .expect(409);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('can remove existing task', async () => {
      const createReq: CreateTaskRequest = {
        description: 'my new task',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createReq)
        .expect(201);
      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect([{ id: 1, description: 'my new task' }]);
      await request(app.getHttpServer()).delete(`/tasks/${1}`).expect(204);
      await request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
    });

    test.each`
      message              | id       | res                                                                    | resCode
      ${'wrong id type'}   | ${'-18'} | ${{ statusCode: 400, message: 'Invalid positive number entered -18' }} | ${400}
      ${'non existing id'} | ${18}    | ${{ statusCode: 404, message: 'Invalid id 18 supplied' }}              | ${404}
    `('fails with $message', async ({ id, res, resCode }) => {
      await request(app.getHttpServer())
        .delete(`/tasks/${id}`)
        .expect(resCode)
        .expect(res);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
