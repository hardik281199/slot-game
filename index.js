const mysql =require('mysql');
const express = require('express');
const game = require('./controller/game');
var app = express();

//const router = Router();
// var mysqlConn = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'Root@123',
//     database:'project_db'
// });

// mysqlConn.connect((err)=>{

//     if(!err){
//         console.log('db connection success');
//     }
//     else{
//         console.log('db connection failed \n');
//     }
// });

//controllergame();
//     res.status(200).send(slotgame.matrix());
// })

app.post('/spin', game.matrix);

app.listen(3001,()=> console.log('Exapress server is runing at port no :3001'));
module.exports = app;