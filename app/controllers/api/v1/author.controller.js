const Author = require("../../../models/index").Author;
const asyncHandler = require("express-async-handler");

module.exports = {
  index: asyncHandler(async (req, res, next) => {
    const authors = await Author.findAll(
      { limit: 50, order: [['id', 'asc']] }
    )
    res.json(authors);
  }),

  find: asyncHandler(async (req, res, next) => {
    const author = await Author.findByPk(req.params.id);
    if (author === null)
      res.status(404).json({});
    else
      res.json(author);
  }),

  create: asyncHandler(async (req, res, next) => {
    const newAuthor = await Author.create(req.body);
    res.status(201).json(newAuthor);
  }),

  update: asyncHandler(async (req, res, next) => {
    const author = await Author.findByPk(req.params.id);
    if (author === null) {
      res.status(404).json({});
    } else {
      await author.update(req.body);
      res.json(author);
    }
  }),

  destroy: asyncHandler(async (req, res, next) => {
    const author = await Author.findByPk(req.params.id);
    if (author === null) {
      res.status(404).json({});
    } else {
      await author.destroy();
      res.json(author);
    }
  })
}
