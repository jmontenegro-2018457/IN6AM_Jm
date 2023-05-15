'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAuth = (req,res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Headers no content'});
    }else{
        try {
            let token = req.headers.authorization.replace(/['"]+/g, '');

            var payload = jwt.decode(token,`${process.env.SECRET_KEY}`);

            if(Math.floor(Date.now()/1000) >= payload.exp){
                return res.status(401).send({message: 'Expired token'});
            }

        } catch (error) {
            console.error(error);
            return res.status(400).send({message: 'Invalid token'})
        }

        req.user = payload;
        next();
    }
}

exports.isAdmin = async(req, res,next)=>{
    try {
        let user = req.user;
        if(user.role == 'ADMIN') return next();
        return res.status(403).send({message: 'User unathorized is not admin'});
    } catch (error) {
        console.error(error);
        return res.status(403).send({message: 'User unathorized'});
    }
}
