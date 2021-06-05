const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
require('./src/route/routes')(app);

app.listen(process.env.PORT,() => console.log(`Exapress server is runing at port no :${process.env.PORT}`));
module.exports = app;