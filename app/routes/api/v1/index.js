const router = require('express').Router();

router.use('/authors', require('./author.route'));
router.use('/genres', require('./genre.route'));
router.use('/books', require('./book.route'));

module.exports = router;
