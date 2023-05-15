'use strict'

const billController = require('./bill.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated')


api.get('/', billController.test);
api.get('/getByUser',[ensureAuth, isAdmin], billController.getByUser);
api.get('/getByLogged',ensureAuth, billController.getByLogged);
api.post('/cart', ensureAuth, billController.cart);
api.post('/createBill', ensureAuth, billController.createBill);
api.post('/deleteFromCart', ensureAuth, billController.deleteFromCart);
api.put('/update/:id',[ensureAuth, isAdmin], billController.update);


module.exports = api;