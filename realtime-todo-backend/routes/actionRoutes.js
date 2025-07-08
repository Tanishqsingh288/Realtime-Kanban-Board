const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const { getRecentActions } = require('../controllers/actionLogController');

router.get('/', verifyToken, getRecentActions);

module.exports = router;
