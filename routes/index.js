const express = require('express');
const router = express.Router();

router.use('/user', require('./userApi.js'));

module.exports = router;