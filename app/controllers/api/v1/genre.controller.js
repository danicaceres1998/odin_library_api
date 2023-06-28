const Genre = require("../../../models/index").Genre;
const asyncHandler = require("express-async-handler");

module.exports = {
  index: asyncHandler(async (req, res, next) => {
    const genres = await Genre.findAll(
      { limit: 50, order: [['id', 'asc']] }
    );
    res.json(genres);
  }),

  find:asyncHandler(async (req, res, next) => {
    const genre = await Genre.findByPk(req.params.id);
    if (genre === null)
      res.status(404).json({});
    else
      res.json(genre);
  }),

  create: asyncHandler(async (req, res, next) => {
    const genre = await Genre.create(req.body);
    res.status(201).json(genre);
  }),

  update: asyncHandler(async (req, res, next) => {
    const genre = await Genre.findByPk(req.params.id);
    if (genre === null) {
      res.status(404).json({});
    } else {
      await genre.update(req.body);
      res.json(genre);
    }
  }),

  destroy: asyncHandler(async (req, res, next) => {
    const genre = await Genre.findByPk(req.params.id);
    if (genre === null) {
      res.status(404).json({});
    } else {
      await genre.destroy();
      res.json(genre);
    }
  })
};
