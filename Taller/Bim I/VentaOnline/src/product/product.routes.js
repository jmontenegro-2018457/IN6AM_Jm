'use strict'

const productController = require('./product.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated')


api.get('/', productController.test);
api.post('/register',[ensureAuth, isAdmin], productController.register);
api.put('/update/:id',[ensureAuth, isAdmin], productController.update);
api.put('/updateStock/:id',[ensureAuth, isAdmin], productController.updateStock);
api.delete('/delete/:id',[ensureAuth, isAdmin], productController.delete);
api.get('/get', ensureAuth, productController.getProducts);
api.get('/search', ensureAuth ,productController.search);
api.get('/searchByCategory',ensureAuth ,productController.searchByCategory);
api.get('/getOutOfStockProducts', [ensureAuth, isAdmin] ,productController.getOutOfStockProducts)
api.get('/getBestSellingProducts',ensureAuth ,productController.getBestSellingProducts)

module.exports = api;