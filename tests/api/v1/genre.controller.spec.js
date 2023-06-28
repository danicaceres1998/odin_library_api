const request = require('supertest');
const app = require('../../../app');
const { db, truncate_table, factory } = require('../../models/index');
const { faker } = require('@faker-js/faker');
const Genre = db.Genre;

describe('test on the genre routes and controller', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /api/v1/genres', () => {
    it('should test if return a list of genres', async () => {
      const response = await request(app).get('/api/v1/genres').send();
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/genres/:id', () => {
    afterEach(() => {
      truncate_table(Genre);
    });

    it('should send an author by the id', async () => {
      const genre = await factory.createGenre();
      const response = await request(app).get(`/api/v1/genres/${genre.id}`).send();

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(genre.id)
    });

    it('should return not found if the id does not exists', async () => {
      const response = await request(app).get(`/api/v1/genres/${faker.number.int(5000)}`).send();

      expect(response.status).toBe(404);
      expect(response.header['content-type']).toContain('json');
    });
  });

  describe('POST /api/v1/genres', () => {
    afterEach(() => {
      truncate_table(Genre);
    })

    it('should create a new genre', async () => {
      const response = await request(app).post('/api/v1/genres').send(
        factory.buildGenre()
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(
        (await Genre.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      );
    });

    it('should return an error if the attributes are not valid', async () => {
      const response = await request(app).post('/api/v1/genres').send(
        factory.buildGenre(false)
      );

      expect(response.status).toBe(500);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/v1/genres/:id', () => {
    afterEach(() => {
      truncate_table(Genre);
    })

    it('should update an existing genre', async () => {
      const genre = await factory.createGenre();
      const updateParams = { url: faker.internet.url() };
      const response = await request(app).put(`/api/v1/genres/${genre.id}`).send(updateParams);

      expect(response.status).toBe(200);
      expect(response.body.url).toBe(updateParams.url);
    });

    it('should not update a non existing genre', async () => {
      const response = await request(app).put(
        `/api/v1/genres/${faker.number.int(5000)}`
      ).send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });
  });

  describe('DELETE /api/v1/genres/:id', () => {
    afterEach(() => {
      truncate_table(Genre);
    });

    it('should delete an existing genre', async () => {
      const genre = await factory.createGenre();
      const response = await request(app).delete(`/api/v1/genres/${genre.id}`).send();

      expect(response.status).toBe(200);
      expect(await Genre.findByPk(genre.id)).toBe(null);
    });

    it('should not delete a genre if it does not exists', async () => {
      const response = await request(app).delete(
        `/api/v1/genres/${faker.number.int(5000)}`
      ).send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });
  });
})
