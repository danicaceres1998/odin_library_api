const request = require('supertest');
const app = require('../../../app');
const { db, truncate_table, factory } = require('../../models/index');
const { faker } = require('@faker-js/faker');
const { response } = require('express');
const Book = db.Book;

describe('test on the book routes and controller', () => {
  const mainRoute = '/api/v1/books';
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe(`GET ${mainRoute}`, () => {
    it('should return a list of books', async () => {
      const response = await request(app).get(mainRoute).send();

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
    });
  });

  describe(`GET ${mainRoute}/:id`, () => {
    afterEach(() => {
      truncate_table(Book);
      truncate_table(db.Author);
    });

    it('should return not found if the id does not exists', async () => {
      const response = await request(app).get(
        `${mainRoute}/${faker.number.int(5000)}`
      ).send();

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });

    it('should return the book based on the id', async () => {
      const book = await factory.createBook();
      const response = await request(app).get(`${mainRoute}/${book.id}`).send();

      expect(response.status).toBe(200);
      expect(response.body.id).toEqual(book.id);
    });
  });

  describe(`POST ${mainRoute}`, () => {
    afterAll(() => {
      truncate_table(Book);
      truncate_table(db.Author);
    });

    it('should create a new author', async () => {
      const response = await request(app).post(mainRoute).send(
        await factory.buildBook()
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(
        (await Book.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      );
    });

    it('should return an error when the object is invalid', async () => {
      const response = await request(app).post(mainRoute).send(
        await factory.buildBook(false)
      )

      expect(response.status).toBe(500);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.error).toBeDefined();
    });
  });

  describe(`PUT ${mainRoute}/:id`, () => {
    afterEach(() => {
      truncate_table(Book);
      truncate_table(db.Author);
    });

    it('should update a existing author', async () => {
      const book = await factory.createBook();
      const updateParams = { title: faker.lorem.sentence(1) };
      const response = await request(app).put(`${mainRoute}/${book.id}`).send(updateParams);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.id).toEqual(book.id);
      expect(response.body.title).toBe(updateParams.title);
    });

    it('should return not exist if the id is not valid', async () => {
      const response = await request(app).put(
        `/api/v1/authors/${faker.number.int(5000)}`
      ).send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });
  });

  describe(`DELETE ${mainRoute}/:id`, () => {
    afterEach(() => {
      truncate_table(Book);
      truncate_table(db.Author);
    });

    it('should delete a existing author', async () => {
      const book = await factory.createBook();
      const response = await request(app).delete(`${mainRoute}/${book.id}`).send();

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.id).toEqual(book.id);
      expect(await Book.findByPk(book.id)).toBe(null);
    });

    it('should return not exist if the id is not valid', async () => {
      const response = await request(app).delete(
        `${mainRoute}/${faker.number.int(5000)}`
      ).send();

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('json');
    });
  });
});
