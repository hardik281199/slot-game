var arr =  ["H1","H2","A","K","WILD","J","H3","SCATTER"];
var wallet =200000;
var betAmount = 100;
var freeSpin = 0;
class SlotGame {
    /**
     * generate ArrayOfNum
     * @param {*} low  first index of reel config
     * @param {*} high last index of reel config
     * @returns ArrayOfNumbers Ex :[1,2,3,4,5]
     */
    static randomInt(low, high){ 
        let numOfArry = [];
        for (let i = 0; i < 5; i++) {
            const element = Math.floor(Math.random() * (high - low + 1) + low);
            numOfArry.push(element);            
        }
        return numOfArry
    }
    
    /**
     * It returns particular symbol at requested reel & column index from reel configuration
     * @param {*} randomArr random array
     * @param {*} reelLength length of random array
     * @param {*} reel number of reel
     * @param {*} col number of col
     * @returns symbole of array ex :[h1+1,h2+1,h3+3,h4+4,h5+5]
     */
     static getSymbol(randomArr, reelLength, reel, col){
        return arr[(randomArr[reel] + col) % reelLength]
    }

    /**
     * create Payline in view zone
     * @returns array of payline ex : [0,0,0,0,0]
     * 
     */
    static payarray(){
        let Payline = [[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,0,1,2,2],[2,2,1,0,0]];        
        return Payline;
    }

    /**
     * 
     * @returns json data of smymbol of kind multipler
     * 
     */
    static paytable(){
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

    static freeSpin (){
        for (let index = 1; index <= 5; index++) {
            betAmount = 0;
            if (index === 5){
                freeSpin--;
            }
            
        }
    }

    /**
     * calculation of match payline and return json data,win amount
     * @param {*} req 
     * @param {*} res 
     */
    static matrix(req, res){
        console.log(this);
        const randomNumber = SlotGame.randomInt(0,7);
        console.log(randomNumber);
        let result =[];

        /**
         * prepared json reel of viewZone
         */
        const viewZone = {
            reel0: [],
            reel1: [],
            reel2: [],
            reel3: [],
            reel4: []
        };        
        let generatedArray = [];
        
        //create view zone
        for(let reel = 0;reel < 5;reel++){
            for(let col = 0; col< 3; col++) {
                 const symbol = SlotGame.getSymbol(randomNumber,arr.length, reel, col);
                 console.log(reel);
                 viewZone[`reel${reel}`].push(symbol);
            }
            generatedArray.push(viewZone[`reel${reel}`])
        }
        
        //create Reel X colume matrix
        let matrixReelXCol = [];
        for (let matrixCol = 0; matrixCol < 3; matrixCol++) {
            let arrar = [];           
            
            for (let matrixRow = 0; matrixRow < 5; matrixRow++) {
                var num = generatedArray[matrixRow][matrixCol];
                arrar[matrixRow] = num;
            }            
            matrixReelXCol.push(arrar);                      
        } 
        console.log(matrixReelXCol);
        let d = 0;
        var payarray =SlotGame.payarray();
        let sactterCount = 0;

        // in matrix check payline available 
        for (let a = 0; a < matrixReelXCol.length; a++) {
            for (let b = 0; b < payarray.length; b++) { 
                let symbol = matrixReelXCol[a][d];
                let checkScatter= matrixReelXCol[a][b];
                
                //checkScatter
                if (checkScatter === 'SCATTER' && freeSpin === 0){
                    sactterCount++;
                }
                
                let payline = payarray[b];
                let count = 0;
                
                console.log(payline);
                if(payline[0] === a && symbol !== 'SCATTER'){
                    count++;
                    for (let c = 1; c < payline.length; c++) {
                        if (symbol === 'WILD' && matrixReelXCol[payline[c]][c] !== 'SCATTER'){
                             symbol = matrixReelXCol[payline[c]][c];
                             count++;
                             continue;
                        }
                        if (matrixReelXCol[payline[c]][c] != 'WILD' && matrixReelXCol[payline[c]][c] != symbol){
                            break;
                        }
                        count++;
                    }
                    if (count > 2){
                        var Pay = SlotGame.paytable();
                        console.log(symbol);
                        console.log(payline);
                        console.log(Pay[`${symbol}`][`${count}ofakind`]);
                        console.log("betAmount  "+betAmount * Pay[`${symbol}`][`${count}ofakind`]);
                        wallet += betAmount * Pay[`${symbol}`][`${count}ofakind`] - betAmount;
                        console.log("wallet     "+wallet);
                        result.push({symbol,wintype : `${count}ofakind`,Payline : payline ,WinAmount : betAmount * Pay[`${symbol}`][`${count}ofakind`]})  
                    }
                    
                }
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
        res.send({
            viewZone  : viewZone,
            result    : result,
            betAmount : betAmount, 
            wallet    : wallet,
            freeSpin  : freeSpin
        })            
    }
}

// const slotGame = new SlotGame();
module.exports = SlotGame
// export default SlotGame;