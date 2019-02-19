const express = require('express');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json()); // converts the data to JSON format 

app.post('/api/user', (req, res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    }).save((err, response)=>{
        if(err) res.status(400).send(err)
        res.status(200).send(response)
    })
})





const port = process.env.PORT || 4000 ;

app.listen(port,()=>{
    console.log(`server running on ${port}`);
});