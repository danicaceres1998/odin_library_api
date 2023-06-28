const request = require('supertest');
const app = require('../../../app');
const { db, truncate_table, factory } = require('../../models/index');
const { faker } = require('@faker-js/faker');
const Author = db.Author;

describe('test on the author routes and controller', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /api/v1/authors', () => {
    it('should test if the route works', async () => {
      const response = await request(app).get('/api/v1/authors').send();
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/authors/:id', () => {
    afterEach(() => {
      truncate_table(Author);
    });

    it('should return not found if the is not found', async () => {
      const response = await request(app).get(
        `/api/v1/authors/${faker.number.int(5000)}`
      ).send();

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });

    it('should return the author based on the id', async () => {
      const author = await factory.createAuthor();
      const response = await request(app).get(`/api/v1/authors/${author.id}`).send();

      expect(response.status).toBe(200);
      expect(response.body.id).toEqual(author.id);
    });
  });

  describe('POST /api/v1/authors/', () => {
    afterAll(() => {
      truncate_table(Author);
    });

    it('should create a new author', async () => {
      const response = await request(app).post('/api/v1/authors').send(
        factory.buildAuthor()
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(
        (await Author.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      );
    });

    it('should return an error when the object is invalid', async () => {
      const response = await request(app).post('/api/v1/authors').send(
        factory.buildAuthor(false)
      );

      expect(response.status).toBe(500);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/v1/authors/:id', () => {
    afterEach(() => {
      truncate_table(Author);
    });

    it('should update a existing author', async () => {
      const author = await factory.createAuthor();
      const updateParams = { date_of_death: new Date() };
      const response = await request(app).put(`/api/v1/authors/${author.id}`).send(updateParams);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.id).toEqual(author.id);
      expect(
        response.body.date_of_death
      ).toBe(updateParams.date_of_death.toISOString());
    });

    it('should return not exist if the id is not valid', async () => {
      const response = await request(app).put(
        `/api/v1/authors/${faker.number.int(5000)}`
      ).send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });
  });

  describe('DELETE /api/v1/authors/:id', () => {
    afterEach(() => {
      truncate_table(Author);
    });

    it('should delete a existing author', async () => {
      const author = await factory.createAuthor();
      const response = await request(app).delete(`/api/v1/authors/${author.id}`).send();

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.id).toEqual(author.id);
      expect(await Author.findByPk(author.id)).toBe(null);
    });

    it('should return not exist if the id is not valid', async () => {
      const response = await request(app).delete(
        `/api/v1/authors/${faker.number.int(5000)}`
      ).send();

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });
  });
});
