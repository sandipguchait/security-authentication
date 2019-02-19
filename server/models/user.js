const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT = 10;

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength:6
    }
});


//Hashing the password before saving to database
userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(SALT, function(err,salt){
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt , function (err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else(
        next()
    )
})


const User = mongoose.model('User', userSchema);

module.exports = { User }