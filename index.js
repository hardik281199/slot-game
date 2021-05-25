const mysql =require('mysql');
const express = require('express');
//const router = require('router');
//const pacificRailRoad = require('../../controller/game');
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

app.listen(3001,()=> console.log('Exapress server is runing at port no :3001'));

let arr=["H1","H2","A","K","WILD","J","H3","SCATTER"];
let wallet =200000;
let betAmount = 100;
let freeSpin = 0;
class Slotgame{
    
    randomInt(low, high){ 
        let numOfArry = [];
        for (let i = 0; i < 5; i++) {
            const element = Math.floor(Math.random() * (high - low + 1) + low);
            numOfArry.push(element);
            
        }
        
        return numOfArry
    }

    getSymbol(randomArr, reelLength, i, j){
        return arr[(randomArr[i] + j) % reelLength]
    }

    payarray(){
        let Payline = [[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,0,1,2,2],[2,2,1,0,0]];        
        return Payline;
    }

    paytable(){
        let payTable = {
            "H1":{
                "3ofakind":50,
                "4ofakind":150,
                "5ofakind":500
            },
            "H2":{
                "3ofakind":40,
                "4ofakind": 100,
                "5ofakind": 250
            },
            "H3":{
                "3ofakind": 30,
                "4ofakind": 100,
                "5ofakind": 150
            },
            "A":{
                "3ofakind": 20,
                "4ofakind": 40,
                "5ofakind": 80
            },
            "K":{
                "3ofakind": 10,
                "4ofakind": 20,
                "5ofakind": 40
            },
            "J":{
                "3ofakind": 5,
                "4ofakind": 10,
                "5ofakind": 20
            },
        }
        return payTable;
    }
    freeSpin (){
        for (let index = 1; index <= 5; index++) {
            betAmount = 0;
            if (index === 5){
                freeSpin--;
            }
            
        }
    }

    matrix(){
        const randomNumber = this.randomInt(0,7);
        let c1= randomNumber;
        
        let result =[];

        const reel = {
            reel0: [],
            reel1: [],
            reel2: [],
            reel3: [],
            reel4: []
        };
        let generatedArray = [];
        for(let i = 0;i < 5;i++){
            var real=reel[`reel${i}`];
            for(let j = 0; j< 3; j++) {
                 const symbol = this.getSymbol(randomNumber,arr.length, i, j)
                reel[`reel${i}`].push(symbol);
            }
            generatedArray.push(reel[`reel${i}`])
        }
        console.log(reel);
        console.log(generatedArray);
        let checkDemo = [];
        for (let y = 0; y < 3; y++) {
            let arrar = [];           
            
            for (let j = 0; j < 5; j++) {
                var num = generatedArray[j][y];
                arrar[j] = num;
            }            
            checkDemo.push(arrar);                      
        } 
        console.log(checkDemo);
        let d = 0;
        var payarray =this.payarray();
        let sactterCount = 0;
        for (let a = 0; a < checkDemo.length; a++) {
            for (let b = 0; b < payarray.length; b++) { 
                let symbol = checkDemo[a][d];
                let checkItem = checkDemo[a][b];
                //console.log(checkItem);
                if (checkItem === 'SCATTER' && freeSpin === 0){
                    sactterCount++;
                }
                
                let payline = payarray[b];
                let count = 0;
                
                console.log(payline);
                if(payline[0] === a && symbol !== 'SCATTER'){
                    count++;
                    for (let c = 1; c < payline.length; c++) {
                        if (symbol === 'WILD' && checkDemo[payline[c]][c] !== 'SCATTER'){
                             symbol = checkDemo[payline[c]][c];
                             count++;
                             continue;
                        }
                        if (checkDemo[payline[c]][c] != 'WILD' && checkDemo[payline[c]][c] != symbol){
                            break;
                        }
                        count++;
                    }
                    if (count > 2){
                        var Pay = this.paytable();
                        console.log(symbol);
                        console.log(payline);
                        console.log(Pay[`${symbol}`][`${count}ofakind`]);
                        console.log("betAmount  "+betAmount * Pay[`${symbol}`][`${count}ofakind`]);
                        wallet += betAmount * Pay[`${symbol}`][`${count}ofakind`] - betAmount;
                        console.log("wallet     "+wallet); 
                        // result.symbol = symbol;
                        // result.Payline = payline;
                        // result.OfAkind = `${count}ofakind`;
                        // result.WinAmunt = betAmount * Pay[`${symbol}`][`${count}ofakind`];
                        //  result.betAmount = betAmount;
                        // result.wallet = wallet;
                        result.push({symbol,wintype : `${count}ofakind`,Payline : payline ,WinAmunt : betAmount * Pay[`${symbol}`][`${count}ofakind`],betAmount : betAmount, wallet :wallet})  
                    }
                    
                }
                
                
                //console.log(wallet);
                //console.log(betAmount);
                
            }
        }
        console.log(sactterCount);
        if (sactterCount > 2) {
            freeSpin =5 ;
        }
        if (result.length === 0){
            wallet -= betAmount;
            console.log(wallet);
            result.push({betAmount : betAmount, wallet :wallet})
        }
        
        return {
            viewZone : reel,
            result    : result,
            freeSpin  : freeSpin
        };

    }

}

app.post('/spin',(req,res)=>{
    const slotgame = new Slotgame();
    res.status(200).send(slotgame.matrix());
})

//module.exports = router;