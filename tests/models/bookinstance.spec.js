const {
  db, DatabaseError, truncate_table, factory
} = require('./index');
const BookInstance = db.BookInstance;

describe(BookInstance, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('validations', () => {
    afterEach(() => {
      truncate_table(BookInstance);
      truncate_table(db.Book);
      truncate_table(db.Author);
    });

    it('should create a new book instance', async () => {
      const bookInstance = await factory.createBookInstance();
      expect(bookInstance.id).toBe(
        (await BookInstance.findAll({ limit: 1, order: [['id', 'desc']] }))[0].id
      );
    });

    it('should not create a new book instance and raise an error', () => {
      expect(async () => {
        await factory.createBookInstance({ first_name: null }, true);
      }).rejects.toThrow(DatabaseError);
    });
  });

  describe('associations', () => {
    afterEach(async () => {
      truncate_table(BookInstance);
      truncate_table(db.Book);
      truncate_table(db.Author);
    });

    it('should belong to one book', async () => {
      const bookInstance = await factory.createBookInstance();
      const book = await db.Book.findByPk(bookInstance.book_id);
      expect(book).not.toBe(null);
      expect(book.id).toBe(bookInstance.book_id);
    });
  });
});
