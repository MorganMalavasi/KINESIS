const express = require('express');
const router = express.Router();

router.use('/user', require('./userApi.js'));
router.use('/courses/book', require('./coursesApi.js'));

module.exports = router;