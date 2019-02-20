const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

bcrypt.genSalt(10, (err, salt)=> {
    if(err) return next(err);

    bcrypt.hash('123456', salt, (err,hash)=>{
        if(err) return next(err);
        console.log(hash)
    })
})