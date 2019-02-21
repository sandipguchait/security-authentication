const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    },
    token: {
        type: String
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

//comparing passwords
userSchema.methods.comparePassword = function(candidatePassword, cb){
    
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

// creating and storing token 
userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'supersecret');
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

userSchema.statics.findByToken = function(token,cb){
    const user = this;
    jwt.verify(token,'supersecret', function(err,decode){
        user.findOne({ "_id": decode, "token":token, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        }})
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User }