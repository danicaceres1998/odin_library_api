const {
  db, DatabaseError, truncate_table, factory
} = require('./index');
const Book = db.Book;

describe(Book, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('validations', () => {
    afterEach(() => {
      truncate_table(Book);
      truncate_table(db.Author);
    });

    it('should create a new book', async () => {
      const book = await factory.createBook();
      expect(book.id).toBe(
        (await Book.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      )
    });

    it('should not create a new book and raise an error', () => {
      expect(async () => {
        await factory.createBook({ title: null }, true);
      }).rejects.toThrow(DatabaseError);
    })
  });

  describe('associations', () => {
    afterEach(() => {
      truncate_table(Book);
      truncate_table(db.Author);
      truncate_table(db.Genre);
    });
    it('should belong to one author', async () => {
      const book = await factory.createBook();
      const author = await db.Author.findByPk(book.author_id);
      expect(author).not.toBe(null);
      expect(author.id).toBe(book.author_id);
    });

    it('should has many genres', async () => {
      const book = await factory.createBook();
      const genres = [];
      const amount = Math.floor(Math.random() * (5 - 2) + 2);
      for (let idx = 0; idx < amount; idx++) {
        let genre = await factory.createGenre()
        genres.push(genre)
      }
      await book.addGenres(genres);

      const db_genres = await book.countGenres()
      expect(db_genres).toBe(genres.length);
    });
  });
});
