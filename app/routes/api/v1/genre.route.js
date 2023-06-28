const router = require('express').Router();
const genreController = require('../../../controllers/api/v1/genre.controller');

router.get('/', genreController.index);
router.get('/:id', genreController.find);
router.post('/', genreController.create);
router.put('/:id', genreController.update);
router.delete('/:id', genreController.destroy);

module.exports = router;
