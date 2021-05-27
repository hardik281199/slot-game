const BodyParser = require('body-parser');
const JsonWebToken = require('jsonwebtoken');
const UUID = require('uuid');
const express = require('express');
const game = require('./controller/game');
const login = require('./authentication/auth');
const connection = require('./connection/connection')
var app = express();

app.post('/spin', game.matrix);

app.listen(3001,()=> console.log('Exapress server is runing at port no :3001'));
module.exports = app;