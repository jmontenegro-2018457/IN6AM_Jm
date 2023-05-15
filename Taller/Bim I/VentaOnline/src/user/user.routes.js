'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated')


api.get('/', userController.test);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', ensureAuth , userController.update);
api.delete('/delete/:id', ensureAuth, userController.delete);
api.put('/updatePassword/:id', ensureAuth, userController.updatePassword);

module.exports = api;