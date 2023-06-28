const {
  db, DatabaseError, truncate_table, factory
} = require('./index');
const { faker } = require('@faker-js/faker');
const Author = db.Author;

describe(Author, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('validations', () => {
    afterEach(() => {
      truncate_table(Author);
    });

    it('should create a new author', async () => {
      const author = await factory.createAuthor();
      expect(author.id).toBe(
        (await Author.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      );
    })

    it('should not create a new author and raise an error', () => {
      expect(async () => {
        await Author.create({ first_name: null });
      }).rejects.toThrow(DatabaseError);
    });
  });

  describe('associations', () => {
    afterEach(async () => {
      truncate_table(db.Book);
      truncate_table(Author);
    });

    it('should have many books', async () => {
      const author = await factory.createAuthor();
      let books = await author.countBooks();
      expect(books).toBe(0);

      let amount_books = Math.floor(Math.random() * (5 - 1) + 1);
      for (let idx = 0; idx < amount_books; idx++) {
        await author.createBook({
          title: faker.lorem.sentence(1),
          author_id: author.id,
          summary: faker.lorem.lines(2),
          isbn: null,
          url: null
        });
      }
      books = await author.countBooks();
      expect(books).toBe(amount_books);
    });
  });
});
