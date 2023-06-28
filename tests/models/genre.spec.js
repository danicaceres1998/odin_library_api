const {
  db, DatabaseError, truncate_table, factory
} = require('./index');
const { faker } = require('@faker-js/faker');
const Genre = db.Genre;

describe(Genre, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('validations', () => {
    afterEach(() => {
      truncate_table(Genre);
    });

    it('should create a new genre', async () => {
      const genre = await factory.createGenre();
      expect(genre.id).toBe(
        (await Genre.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      );
    });

    it('should not create a new author and raise an error', () => {
      expect(async () => {
        await factory.createGenre({ name: null }, true);
      }).rejects.toThrow(DatabaseError);
    });
  });

  describe('associations', () => {
    afterEach(async () => {
      truncate_table(db.Book);
      truncate_table(db.Author);
      truncate_table(Genre);
    });

    it('should have many books', async () => {
      const genre = await factory.createGenre();
      let books = await genre.countBooks();
      expect(books).toBe(0);

      let amount_books = Math.floor(Math.random() * (5 - 1) + 1);
      const author = await factory.createAuthor();
      for (let idx = 0; idx < amount_books; idx++) {
        await genre.createBook({
          title: faker.lorem.sentence(1),
          author_id: author.id,
          summary: faker.lorem.lines(2),
          isbn: null,
          url: null
        });
      }

      books = await genre.countBooks();
      expect(books).toBe(amount_books);
    });
  });
});
