import { Controller, Get, Query } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PaginatedViewDto } from '../core/dto/base.paginated.view-dto';
import { BaseQueryParams } from '../core/dto/base.query-params.input-dto';
import { appSetup } from './app.setup';

@Controller('pagination')
class PaginationController {
  @Get()
  getPage(@Query() query: BaseQueryParams) {
    return {
      ...PaginatedViewDto.mapToView({
        items: [],
        page: query.pageNumber,
        size: query.pageSize,
        totalCount: 21,
      }),
      skip: query.calculateSkip(),
      sortDirection: query.sortDirection,
    };
  }
}

describe('Shared application setup', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [PaginationController],
    }).compile();
    app = module.createNestApplication();
    appSetup(app);
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('applies pagination defaults to an empty query', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/pagination')
      .expect(200);

    expect(response.body).toEqual({
      items: [],
      totalCount: 21,
      pagesCount: 3,
      page: 1,
      pageSize: 10,
      skip: 0,
      sortDirection: 'desc',
    });
  });

  it('transforms query strings and preserves DTO methods', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/pagination?pageNumber=3&pageSize=5&sortDirection=asc')
      .expect(200);

    expect(response.body).toMatchObject({
      page: 3,
      pageSize: 5,
      pagesCount: 5,
      skip: 10,
      sortDirection: 'asc',
    });
  });

  it.each([
    'pageNumber=0',
    'pageNumber=-1',
    'pageNumber=1.5',
    'pageSize=0',
    'pageSize=abc',
    'sortDirection=invalid',
  ])('rejects invalid pagination: %s', async (query) => {
    await request(app.getHttpServer())
      .get(`/api/pagination?${query}`)
      .expect(400);
  });

  it('does not expose API routes without the prefix', async () => {
    await request(app.getHttpServer()).get('/pagination').expect(404);
  });

  it('exposes Swagger UI and documents prefixed routes', async () => {
    await request(app.getHttpServer()).get('/api/').expect(200);
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    expect(response.body.paths).toHaveProperty('/api/pagination');
  });
});
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
