const BodyParser = require('body-parser');
const express = require('express');
const  { slotGame } = require('./controller/game');
const { auth } = require('./authentication/auth');
//const connection = require('./connection/connection')
var app = express();

app.use(BodyParser.json());
app.set("jwt-secret", "hardikdobariya");
app.post('/login',auth.login);
app.post('/register',auth.register);
app.post('/spin', slotGame.matrix);

app.listen(3001,() => console.log('Exapress server is runing at port no :3001'));
module.exports = app;