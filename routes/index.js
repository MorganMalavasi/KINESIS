const express = require('express');
const router = express.Router();

router.use('/user', require('./userApi.js'));
router.use('/courses/book', require('./coursesApi.js'));
router.use('/admin/log', require('./adminApi.js'));

module.exports = router;