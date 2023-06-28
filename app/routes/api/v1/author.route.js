const router = require('express').Router();
const authorController = require('../../../controllers/api/v1/author.controller');

router.get('/', authorController.index);
router.get('/:id', authorController.find);
router.post('/', authorController.create);
router.put('/:id', authorController.update);
router.delete('/:id', authorController.destroy);

module.exports = router;
