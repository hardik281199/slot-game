const dotenv = require('dotenv');
const BodyParser = require('body-parser');
const express = require('express');
dotenv.config()
//const connection = require('./connection/con')
var app = express();
require('./route/routes')(app);

app.use(BodyParser.json());

console.log(process.env.PORT);
app.listen(process.env.PORT,() => console.log('Exapress server is runing at port no :3001'));
module.exports = app;