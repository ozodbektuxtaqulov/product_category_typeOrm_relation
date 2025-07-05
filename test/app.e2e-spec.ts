import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM "category"`); // yoki table nomi `categories` bo‘lsa, o‘zgartir
  });

  afterAll(async () => {
    await app.close();
  });

  // CREATE CATEGORY
  it('/category (POST) creates a category', async () => {
    const res = await request(app.getHttpServer())
      .post('/category')
      .send({ name: 'Electronics' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Electronics');
  });

  // GET ALL CATEGORIES
  it('/category (GET) gets all categories', async () => {
    await request(app.getHttpServer())
      .post('/category')
      .send({ name: 'Books' });

    const res = await request(app.getHttpServer()).get('/category').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Books');
  });

  // GET CATEGORY BY ID
  it('/category/:id (GET) gets category by id', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/category')
      .send({ name: 'Clothes' });

    const id = createRes.body.id;

    const res = await request(app.getHttpServer())
      .get(`/category/${id}`)
      .expect(200);

    expect(res.body.name).toBe('Clothes');
  });

  // UPDATE CATEGORY
  it('/category/:id (PATCH) updates category', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/category')
      .send({ name: 'Shoes' });

    const id = createRes.body.id;

    const updateRes = await request(app.getHttpServer())
      .patch(`/category/${id}`)
      .send({ name: 'Sneakers' })
      .expect(200);

    expect(updateRes.body.name).toBe('Sneakers');
  });

  // DELETE CATEGORY
  it('/category/:id (DELETE) deletes category', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/category')
      .send({ name: 'Watches' });

    const id = createRes.body.id;

    await request(app.getHttpServer()).delete(`/category/${id}`).expect(200);

    await request(app.getHttpServer()).get(`/category/${id}`).expect(404);
  });
});
