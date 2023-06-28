const router = require('express').Router();
const bookController = require('../../../controllers/api/v1/book.controller');

router.get('/', bookController.index);
router.get('/:id', bookController.find);
router.post('/', bookController.create);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.destroy);

module.exports = router;
