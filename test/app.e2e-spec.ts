import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';

const databaseName = `blogs_nest_e2e_${process.pid}_${Date.now()}`;

describe('Users API with MongoDB (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let previousUri: string | undefined;

  beforeAll(async () => {
    previousUri = process.env.MONGODB_URI;
    const uri = new URL(
      process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017',
    );
    uri.pathname = `/${databaseName}`;
    process.env.MONGODB_URI = uri.toString();
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    appSetup(app);
    await app.init();
    connection = app.get<Connection>(getConnectionToken());
  }, 30000);

  afterAll(async () => {
    try {
      if (connection?.name === databaseName) {
        await connection.dropDatabase();
      }
    } finally {
      await app?.close();
      if (previousUri === undefined) delete process.env.MONGODB_URI;
      else process.env.MONGODB_URI = previousUri;
    }
  });

  it('creates, reads, filters, paginates, updates and soft-deletes users', async () => {
    const users: { id: string; login: string }[] = [];
    for (const login of ['alice', 'bob', 'carol']) {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          login,
          email: `${login}@example.com`,
          password: 'test-password',
        })
        .expect(201);
      expect(response.body).toMatchObject({
        login,
        email: `${login}@example.com`,
      });
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('password');
      users.push(response.body);
    }

    const saved = await connection
      .collection('users')
      .findOne({ login: 'alice' });
    expect(await bcrypt.compare('test-password', saved!.passwordHash)).toBe(
      true,
    );

    const page = await request(app.getHttpServer())
      .get('/api/users?pageNumber=2&pageSize=1&sortBy=login&sortDirection=asc')
      .expect(200);
    expect(page.body).toMatchObject({
      totalCount: 3,
      pagesCount: 3,
      page: 2,
      pageSize: 1,
    });
    expect(
      page.body.items.map((user: { login: string }) => user.login),
    ).toEqual(['bob']);

    const filtered = await request(app.getHttpServer())
      .get(
        '/api/users?searchLoginTerm=ALICE&searchEmailTerm=carol&sortBy=login&sortDirection=asc',
      )
      .expect(200);
    expect(filtered.body.totalCount).toBe(2);
    expect(
      filtered.body.items.map((user: { login: string }) => user.login),
    ).toEqual(['alice', 'carol']);

    await request(app.getHttpServer())
      .get(`/api/users/${users[0].id}`)
      .expect(200);
    const updated = await request(app.getHttpServer())
      .put(`/api/users/${users[0].id}`)
      .send({ email: 'updated@example.com' })
      .expect(200);
    expect(updated.body.email).toBe('updated@example.com');

    await request(app.getHttpServer())
      .delete(`/api/users/${users[0].id}`)
      .expect(204);
    await request(app.getHttpServer())
      .get(`/api/users/${users[0].id}`)
      .expect(404);
    const remaining = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);
    expect(remaining.body.totalCount).toBe(2);
    const deleted = await connection
      .collection('users')
      .findOne({ login: 'alice' });
    expect(deleted!.deletedAt).toBeInstanceOf(Date);
  });

  it('rejects invalid user input and sorting', async () => {
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ login: '', password: '', email: 'invalid' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/users?sortBy=passwordHash')
      .expect(400);
  });

  it('does not expose the database reset API by default', async () => {
    await request(app.getHttpServer())
      .delete('/api/testing/all-data')
      .expect(404);
  });
});
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
