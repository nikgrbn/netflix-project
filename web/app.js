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
const users = require('./routes/user');
app.use('/api/users', users);
const tokens = require('./routes/token');
app.use('/api/tokens', tokens);

// File uploads
app.use('/uploads', express.static('uploads'));

// Homepage
const categories = require('./routes/category');
app.use('/api/categories', categories);

// Movies
const movies = require('./routes/movie');
app.use('/api/movies', movies);

const site = express.static('../react-client/build/');
app.use("/", site);
app.use("/signup", site);
app.use("/signin", site);
app.use("/home", site);
app.use("/search", site);
app.use("/console", site);
app.use("/categories", site);
app.use("/watch/:id", site);
app.use("/movies/:id", site);

app.listen(process.env.PORT);