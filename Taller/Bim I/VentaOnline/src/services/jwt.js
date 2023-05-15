'use strict'
//archivo para cracion de tokens
const jwt = require('jsonwebtoken');

exports.createToken =async (user)=>{
try {
    let payload = {
        sub : user.id,
        name: user.name,
        username : user.username,
        email : user.email,
        role: user.role,
        iat: Math.floor(Date.now()/1000),
        exp: Math.floor(Date.now()/1000) + (60*120)
    }
    return jwt.sign(payload,'${process.env.SECRET_KEY}');
} catch (error) {
    console.error(error);
    return error;
}
}
