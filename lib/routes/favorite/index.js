'use strict';

const express = require('express');

const controller = require('./favorite.controller');

let router = express.Router();

router.get('/', controller.getAllFavorites);
router.post('/', controller.addFavorite);
router.delete('/:id', controller.removeFavorite);

module.exports = router;
