const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
//mongodb
const MONGOURL = 'mongodb://sandipguchait:roshni77@ds343985.mlab.com:43985/sec-auth'

const app = express();

//connecting  to mongoose database
mongoose.connect(MONGOURL)
.then(()=> console.log("DB connected"))
.catch(error => console.log(error));

//importing models
const { User } = require('./models/user')
const  { auth } = require('./middleware/auth');

app.use(bodyParser.json()); // converts the data to JSON format 
app.use(cookieParser());

app.post('/api/user/signup', (req, res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    }).save((err, response)=>{
        if(err) res.status(400).send(err)
        res.status(200).send(response)
    })
})

app.post ('/api/user/signin',  (req, res)=> {
    //checks that email is present or not
    User.findOne({'email': req.body.email}, (err, user)=> {
        if(!user) res.json({message: 'Login failed, user not found'})
       
        // IF email is present then it will compare password
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(err) throw err;
            if(!isMatch) return res.status(400).json({
                message:'Wrong Password'
            });
            res.status(200).send('Logged in successfully')
        })
    })
});

app.get('/user/profile', auth, (req, res)=>{
    res.status(200).send(req.token)
})




const port = process.env.PORT || 4000 ;

app.listen(port,()=>{
    console.log(`server running on ${port}`);
});