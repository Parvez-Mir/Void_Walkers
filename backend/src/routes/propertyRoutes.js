const express = require('express');
const router = express.Router();
const {getProperty} = require('../controllers/propertyController');

router.get('/:id', getProperty);

module.exports = router;