const { faker } = require('@faker-js/faker');
const { DatabaseError } = require('sequelize');
const db = require('../../app/models/index');
const truncate_table = async function(table) {
  await table.destroy({ truncate: { cascade: true } });
};
const factory = {
  createAuthor(options = {}, strict = false) {
    if (strict) {
      return db.Author.create(options);
    }

    return db.Author.create({
      first_name: options.first_name || faker.person.firstName(),
      family_name: options.family_name || faker.person.lastName(),
      date_of_birth: options.date_of_birth || faker.date.birthdate(),
      date_of_death: options.date_of_death || null,
      name: options.name || faker.person.fullName(),
      lifespan: options.lifespan || null,
      url: options.url || null
    });
  },
  createGenre(options = {}, strict = false) {
    if (strict) {
      return db.Genre.create(options);
    }

    return db.Genre.create({
      name: options.name || faker.lorem.sentence(1),
      url: options.url || faker.internet.url()
    });
  },
  async createBook(options = {}, strict = false) {
    if (strict) {
      return db.Book.create(options);
    }

    let author;
    if (options.author_id) {
      author = await db.Author.findByPk(options.author_id);
    }
    if (author === undefined || author === null) {
      author = await this.createAuthor();
    }
    return db.Book.create({
      title: options.title || faker.lorem.sentence(),
      author_id: author.id,
      summary: options.summary || faker.lorem.lines(2),
      isbn: options.isbn || faker.lorem.lines(2),
      url: options.url || faker.internet.url()
    })
  },
  async createBookInstance(options = {}, strict = false) {
    if (strict) {
      return db.BookInstance.create(options);
    }

    let book;
    if (options.book_id) {
      book = await db.Book.findByPk(options.book_id);
    }
    if (book === undefined || book === null) {
      book = await this.createBook();
    }
    return db.BookInstance.create({
      book_id: book.id,
      imprint: options.imprint || faker.datatype.boolean(0.9),
      status: options.status || db.BookInstance.statuses()[
        Math.floor(Math.random() * db.BookInstance.statuses().length)
      ],
      url: options.url || faker.internet.url()
    })
  },
  buildAuthor(valid = true) {
    return valid ? {
              first_name: faker.person.firstName(),
              family_name: faker.person.lastName(),
              date_of_birth: faker.date.birthdate(),
              date_of_death: null,
              name: faker.person.fullName(),
              lifespan: null,
              url: null
            }
          : { first_name: false, family_name: null };
  },
  buildGenre(valid = true) {
    return valid ? {
              name: faker.lorem.sentence(1),
              url: faker.internet.url()
            }
          : { name: null, url: 1 };
  },
  async buildBook(valid = true) {
    if (valid) {
      const author = await this.createAuthor();
      return {
        title: faker.lorem.sentence(),
        author_id: author.id,
        summary: faker.lorem.lines(2),
        isbn: faker.lorem.lines(2),
        url: faker.internet.url()
      };
    }

    return { title: true, author_id: null };
  },
  async buildBookInstance(valid = true) {
    if (valid) {
      const book = await this.createBook();
      return {
        book_id: book.id,
        imprint: faker.datatype.boolean(0.9),
        status: db.BookInstance.statuses()[
          Math.floor(Math.random() * db.BookInstance.statuses().length)
        ],
        url: faker.internet.url()
      };
    }

    return { book_id: null, status: true };
  }
}

module.exports = {
  db, DatabaseError, truncate_table, factory
};
