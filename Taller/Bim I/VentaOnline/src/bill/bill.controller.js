'use strict'

const jwt = require('jsonwebtoken');
const Product = require('../product/product.model');
const Bill = require ('./bill.model');
const User = require('../user/user.model')

exports.test = (req,res)=>{
    res.send({message:'Test function is running', user: req.user});
}

exports.getByUser = async(req,res)=>{
    try{
        let data = req.body;

        let user = await User.findOne({username: data.username})

        let bill = await Bill.find({
            user: user.id
        }).populate('user').populate('products').lean();

        if(!bill) return res.status(404).send({message:'Bills not found'});
        return res.send({bill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching...'});
    }
}

exports.getByLogged = async(req,res)=>{
  try{
      let bill = await Bill.find({
          user: req.user.sub
      }).populate('user').populate('products').lean();

      if(!bill) return res.status(404).send({message:'Bills not found'});
      return res.send({bill});
  }catch(err){
      console.error(err);
      return res.status(500).send({message: 'Error searching...'});
  }
}

exports.cart = async (req, res) => {
    try {
      const { name, quantity } = req.body;
      const product = await Product.findOne({ name });
      let stock = product.stock;
  
      if (!product) {
        return res.status(404).send({ message: `Product '${name}' not found.` });
      }
  
      if (stock < quantity) {
        return res.send({ message: `There is not enough "${product.name}" in stock` });
      }
  
      const item = {
        productId: product._id,
        quantity,
      };
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user.sub,
        { $push: { cart: item } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.send({ message: "Product not added" });
      }
  
      return res.send({ message: "Product added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was an error adding product to cart", error: error.message });
    }
  };

  exports.deleteFromCart = async (req, res) => {
    try {
      const { name } = req.params;
      const user = await User.findOne({ _id: req.user.sub });
  
      const index = user.cart.findIndex(item => item.name === name);
  
      if (index === -1) {
        return res.status(404).send({ message: `Product not found in cart.` });
      }
  
      user.cart.splice(index, 1);
  
      await user.save(); // Guardar cambios en la base de datos
  
      return res.send({ message: `Product removed from cart successfully` });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error deleting product from cart", error: error.message });
    }
  };

exports.createBill = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.sub });
      if (user.cart.length === 0) {
        return res.send({ message: "The cart is empty" });
      }
  
      let data = {
        total: 0,
        products: [],
        user: user.id,
      };
  
      for (let item of Object.values(user.cart)) {
        let product = await Product.findOne({ _id: item.productId });
        if (product) {
            data.total += product.price * item.quantity;
            data.products.push({
            product: product._id,
            quantity: item.quantity,
            
          });

          product.stock -= item.quantity;
          await product.save();

        } else {
          return res
            .status(404)
            .send({
              message: `Product not found for cart item with id ${item.productId}`,
            });
        }
      }
  
      const bill = new Bill(data);
      user.cart = [];
      await user.save();
      await bill.save();
      data.total= 0;
      return res.send({ message: "Bill created successfully", bill });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Error creating bill", error: error.message });
    }
  };



exports.update = async(req,res)=>{
    try {
        let billId = req.params.id;
        let data = req.body;
        if(data.user || data.user == '') return res.send({message:'You cannot change the user who made the purchase'})
        let billUpdated = await Bill.findOneAndUpdate({_id: billId},data,{new:true});
        if(!billUpdated) return res.status(404).send({message: 'Bill not found and not updated'});
        return res.send({message: 'Bill updated', billUpdated})
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error updating bill'})
    }
}

