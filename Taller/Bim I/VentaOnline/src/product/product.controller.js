'use strict'


const Category = require('../category/category.model')
const Product = require('./product.model');

exports.test = (req,res)=>{
    res.send({message:'Test function is running', user: req.user});
}

exports.getProducts = async(req,res)=>{
    try {
            let products = await Product.find().populate('category').lean();
            return res.send({products});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.getBestSellingProducts = async(req,res)=>{
    try {
            let products = await Product.find().sort({ sales: 'desc' }).limit(3);
            return res.send({products});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.getOutOfStockProducts = async(req,res)=>{
    try {
            let products = await Product.find({stock: 0});
            if(!products) return res.status(404).send({message:'products not found'})
            return res.send({products});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.search = async(req, res)=>{
    try{
        let data = req.body;

        let products = await Product.find({
            name: {
                $regex: data.name, 
                $options: 'i'
            }
        })
        if(!products) return res.status(404).send({message:'products not found'})
        return res.send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching...'});
    }
}

exports.searchByCategory = async(req, res)=>{
    try{
        let data = req.body;

        let category = await Category.findOne({name: data.name})

        let products = await Product.find({
            category: category.id
        })

        if(!products) return res.status(404).send({message:'products not found'})
        return res.send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching...'});
    }
}

exports.register = async(req,res)=>{
    try {
        let data = req.body;
        if(!data.category){
            let defaultCategory = await Category.findOne({name: 'Product'})
            if(!defaultCategory)return res.send({message:'The default category has not been created, so this category cannot be deleted'});
            data.category = defaultCategory.id;
        }
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.status(404).send({message:'Category not found'})
        let product = new Product(data);
        await product.save();
        return res.send({message:'Product created successfully'})
    } catch (err) {
        console.error(err);
        return res.send({message: 'Error creating product',Error: err.message})
    }
}

exports.update = async(req,res)=>{
    try {
        let productId = req.params.id;
        let data = req.body;
        let productUpdated = await Product.findOneAndUpdate({_id: productId},data,{new:true});
        if(!productUpdated) return res.status(404).send({message: 'Product not found and not updated'});
        return res.send({message: 'Product updated', productUpdated})
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error updating product'})
    }
}

exports.updateStock = async(req,res)=>{
    try {
        let productId = req.params.id;
        let stock = req.body.stock;
        let productUpdated = await Product.findOneAndUpdate({_id: productId},{stock: stock},{new:true});
        if(!productUpdated) return res.status(404).send({message: 'Product not found and not updated'});
        return res.send({message: 'Product updated', productUpdated})
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error updating product'})
    }
}

exports.delete = async(req,res)=>{
    try {
        let productId = req.params.id;
        let productDeleted = await Product.findOneAndDelete({_id: productId})
        if(!productDeleted) return res.send({message: 'Product not found and not deleted'});
        return res.send({message: `Product deleted sucessfully`});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error not deleted'});

    }
}