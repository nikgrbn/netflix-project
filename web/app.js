const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');
app.use(cors());

const customENV = require('custom-env').env;
customENV(process.env.NODE_ENV, './config');
console.log("IP: " + process.env.MONGO_URI);
console.log("PORT:" + process.env.PORT);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true 
    });

const articles = require('./routes/user');
app.use('/users', articles);

app.listen(process.env.PORT);