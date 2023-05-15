'use strict'

const Category = require('./category.model');
const Product = require('../product/product.model');

exports.test = (req,res)=>{
    res.send({message:'Test function is running', user: req.user});
}

exports.getCategories = async(req,res)=>{
    try {
            let categories = await Category.find();
            return res.send({categories});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error getting categories'});
    }
}

exports.register = async(req,res)=>{
    try {
        let data = req.body;
        let category = new Category(data);
        await category.save();
        return res.send({message:'Category created successfully'})
    } catch (err) {
        console.error(err);
        return res.send({message: 'Error creating category',Error: err.message})
    }
}

exports.update = async(req,res)=>{
    try {
        let categoryId = req.params.id;
        let data = req.body;
        let categoryUpdated = await Category.findOneAndUpdate({_id: categoryId},data,{new:true});
        if(!categoryUpdated) return res.status(404).send({message: 'Category not found and not updated'});
        return res.send({message: 'Category updated', categoryUpdated})
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error updating category'})
    }
}

exports.delete = async(req,res)=>{
    try {
        let categoryId = req.params.id;
        let defaultCategory = await Category.findOne({name: 'Product'})
        if(!defaultCategory)return res.send({message:'The default category has not been created, so this category cannot be deleted'});
        let categoryDeleted = await Category.findOneAndDelete({_id: categoryId})
        if(!categoryDeleted) return res.send({message: 'Category not found and not deleted'});
        await Product.updateMany(
            {category: categoryId},{category: defaultCategory.id}
        );
        return res.send({message: `Category deleted sucessfully`});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error not deleted'});

    }
}