const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');
app.use(cors());

const customENV = require('custom-env').env;
customENV(process.env.NODE_ENV, './config');
console.log("Database IP: " + process.env.MONGO_URI);
console.log("PORT:" + process.env.PORT);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

// Authentication
const articles = require('./routes/user');
app.use('/users', articles);
const tokens = require('./routes/token');
app.use('/tokens', tokens);

// Homepage
const categories = require('./routes/category');
app.use('/categories', categories);

// Recommend
const recommend = require('./routes/recommend');
app.use('/:id/recommend', recommend);

app.listen(process.env.PORT);