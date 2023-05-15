'use strict'


const User = require('./user.model');
const jwt = require('jsonwebtoken');
//Desestructuración
const { encrypt, checkPassword, validateData } = require('../utils/validate');
const { createToken } = require('../services/jwt');

/* función de prueba */
exports.test = (req,res)=>{
    res.send({message:'Test function is running', user: req.user});
}

/* función para registrar usuario solamente como cliente */
exports.register = async(req,res) =>{
    try {
        let data = req.body;
        data.password = await encrypt(data.password);
        if(!data.role) data.role='CLIENT';
        if(data.role !== 'CLIENT'){
            return res.status(403).send({message: 'This rol is not allowed'})
        }
        let user = new User(data);
        await user.save();
        return res.send({message: 'Account created successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error creating account',Error: error.message});
    }
}

/* función para registrar que valida el registro y puede agregar rol, solamente puede utilizar un administrador */
exports.save = async(req,res)=>{
    try {
        let data = req.body;
        
        let params = {
            name: data.name,
            username: data.username,
            password: data.password,
            email: data.email,
            role: data.role
        }

        let validate = validateData(params);
        if(validate) return res.status(400).send({validate});
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({message: 'Account created successfully'});

    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'Error saving user'})
    }
}


exports.login = async(req, res)=>{
    try {
        let data = req.body;
        let credentials = { username: data.username, password: data.password};
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({msg});
        let user = await User.findOne({username: data.username});
        if(user && await checkPassword(data.password, user.password)){
            let token = await createToken(user);
            
            return res.send({message: 'User logged successfully', token});
        } 
        
        return res.status(404).send({message: 'Invalid credentials'});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error not logged'});
    }
}


exports.delete = async(req, res)=>{
    try{
        let userId = req.params.id;
        if( userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        let userDeleted = await User.findOneAndDelete({_id: req.user.sub});
        if(!userDeleted) return res.send({message: 'Account not found and not deleted'});
        return res.send({message: `Account with username ${userDeleted.username} deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted'});
    }
}


exports.update = async(req, res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        if(data.password || Object.entries(data).length === 0 || data.role) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdated = await User.findOneAndUpdate(
            {_id: req.user.sub},
            data,
            {new: true} 
        )
        if(!userUpdated) return res.status(404).send({message: 'User not found and not updated'});
        return res.send({message: 'User updated', userUpdated})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not updated', err: `Username ${err.keyValue.username} is already taken`});
    }
}


exports.toAdmin = async(req, res) =>{
    try {
        let userId = req.params.id;
        let usuario = await User.findOne({_id: userId});
        let data = req.body;

        if(usuario.role != 'ADMIN'){
            if(data.role != 'ADMIN' || !data.role){
                data.role = 'ADMIN'
            }

            let userToAdmin = await User.findOneAndUpdate(
                {_id: userId},
                data, {new: true});
            if(!userToAdmin) return res.status(404).send({message:'User not found'});
            return res.send({message:'Account updated successfully'});
        } return res.send({message:'You cannot update an Admin'});

    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'Error not updated'})
    }
}


/* función para actualizar password */
exports.updatePassword = async(req, res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        let token = req.headers.authorization.replace(/['"]+/g,'');
        let payload = jwt.decode(token, `${process.env.SECRET_KEY}`);
        if(payload.sub != userId){
            return res.send({message: 'You cannot update this account'});
        }
        let user = await User.findOne({_id: userId});
        if(await checkPassword(data.currentPassword, user.password)){
            data.newPassword = await encrypt(data.newPassword);
            let updatePassword = await User.updateOne({_id: userId}, {$set: {password: data.newPassword}});
            if(!updatePassword) return res.status(404).send({message: 'User not found'});
            return res.send({message: 'Password updated succesfully'});
        }
        return res.status(404).send({message: 'Wrong password, try again'}) 
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'could not update'});
    }
}