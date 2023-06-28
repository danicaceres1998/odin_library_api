const Book = require("../../../models/index").Book;
const asyncHandler = require("express-async-handler");

module.exports = {
  index: asyncHandler(async (req, res, next) => {
    const books = Book.findAll(
      { limit: 50, order: [['id', 'asc']] }
    )
    res.json(books);
  }),

  find: asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null)
      res.status(404).json({});
    else
      res.json(book);
  }),

  create: asyncHandler(async (req, res, next) => {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  }),

  update: asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null) {
      res.status(404).json({});
    } else {
      await book.update(req.body);
      res.json(book);
    }
  }),

  destroy: asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book === null) {
      res.status(404).json({});
    } else {
      await book.destroy();
      res.json(book);
    }
  }),

  addInstance: asyncHandler(async (req, res, next) => {

  }),

  updateInstance: asyncHandler(async (req, res, next) => {

  })
};
