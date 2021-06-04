const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
require('./src/route/routes')(app);

console.log(process.env.PORT);
app.listen(process.env.PORT,() => console.log('Exapress server is runing at port no :3001'));
module.exports = app;