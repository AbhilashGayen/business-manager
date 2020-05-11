const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


const mongoose = require('mongoose');

const customerRoutes = require('./routes/customers');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://Abhi:" + process.env.MONGO_ATLAS_PW + "@smallbusiness-dclyp.mongodb.net/smallBusiness", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Connected to database");
    })
    .catch(() => {
        console.log("Connection Failed")
    });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        'Origin ,X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use('/api/customers', customerRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
