'use strict'

const categoryController = require('./category.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated')


api.get('/', categoryController.test);
api.post('/register',[ensureAuth, isAdmin], categoryController.register);
api.put('/update/:id',[ensureAuth, isAdmin], categoryController.update);
api.delete('/delete/:id',[ensureAuth, isAdmin], categoryController.delete);
api.get('/get', categoryController.getCategories);

module.exports = api;