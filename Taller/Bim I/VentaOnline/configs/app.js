'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3200;


const userRoutes = require('../src/user/user.routes');
const productRoutes = require('../src/product/product.routes');
const categoryRoutes = require('../src/category/category.routes');
const billRoutes = require('../src/bill/bill.routes');


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/user',userRoutes);
app.use('/category', categoryRoutes);
app.use('/product',productRoutes);
app.use('/bill', billRoutes);

//LEVANTAR EL SERVIDOR
exports.initServer= ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}