
const { couchbaseCollection } = require('../connection/con');

// reel configurations for all 5 reels
let arrayOfReel =  [["H1","H2","H3","H1","K","WILD","J","A","H3","SCATTER"]
,["WILD","J","H3","H1","SCATTER","H1","H2","A","K","A"]
,["H1","J","H3","SCATTER","H1","H2","A","J","K","WILD",]
, ["SCATTER","WILD","H2","A","J","H1","H3","K","H1","K"]
,["J","A","H1","K","H3","H2","WILD","A","SCATTER","H1"]];

class SlotGame {

    /**
     * It generates an array of random numbers
     * these random numbers will be used to generate viewzone
     * @param {low}  first index of reel config
     * @param {high} last index of reel config
     * @returns ArrayOfNumbers Ex :[1,2,3,4,5]
     */
    randomInt(low, high){ 
        let numOfArry = [];
        for (let i = 0; i < 5; i++) {
            const element = Math.floor(Math.random() * (high - low + 1) + low);
            numOfArry.push(element);            
        }
        return numOfArry
    }
    
    /**
     * It returns particular symbol at requested reel & column index from reel configuration
     * @param {randomArr} randomArr random array
     * @param {reelLength} reelLength length of random array
     * @param {reel} reel number of reel
     * @param {col} col number of col
     * @returns symbole of array ex :[h1+1,h2+1,h3+3,h4+4,h5+5]
     */
    getSymbol(randomArr,arrayOfReel ,reelLength, reel, col){
        let symbol = arrayOfReel[(randomArr[reel] + col) % reelLength];
        return symbol;
    }

    /**
     * create Payline in view zone
     * @returns array of payline ex : [0,0,0,0,0]
     */
    payarray(){
        let Payline = [[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,0,1,2,2],[2,2,1,0,0]];        
        return Payline;
    }

    /**
     * this function use where pair come in view zone
     * @returns json data of smymbol of kind multipler
     */
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
            }
        }
        return payTable;
    }

    /**
     * set response freeSpin
     * @returns free spin details [numberOfFreespins, currentFreeSpin, freeSpinTriggered] 
     */
    freeSpin(freeSpin , WinFreeSpinAmount , totalfreeSpin ){
        let scatterOffreeSpin = {
            numberOfFreespins: totalfreeSpin,
            remainingSpins: freeSpin,
            freeSpinTriggered: freeSpin > 0 ? 'true' : 'false',
            WinAmount : WinFreeSpinAmount
        }
        
        return scatterOffreeSpin;  
    }

    /**
     * whenever free spin not occurred 
     * @returns wallet 
     */
    debitWinAmount (wallet,betAmount){
         wallet -= betAmount ;
        return wallet
    }

    /**
     * whenever free spin occurred 
     * @param {multipler} multipler total win amount
     * @returns in free spin count total win amount
     */
    creditWinAmount(multipler,betAmount , WinFreeSpinAmount){
        WinFreeSpinAmount += betAmount * multipler;

        return WinFreeSpinAmount;
    }

    /**
     * calculation of match payline and return json data,win amount
     * @param {*} req 
     * @param {*} res 
     */
    matrix = (req, res) => {
        
        couchbaseCollection.get(req.token.email,(error,reslt)=>{
            if (!reslt.content.jwt){
                return res.status(401).send({ "success": false, "message": "Invalid Authoriz" });
            } else {
                let wallet = reslt.content.wallet;
                let betAmount = reslt.content.betAmount;
                let freeSpin = reslt.content.freeSpin;
                let WinFreeSpinAmount = reslt.content.WinFreeSpinAmount;
                let totalfreeSpin = reslt.content.totalfreeSpin; 
                
                const randomNumber = this.randomInt(0,9);
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
                        const symbol = this.getSymbol(randomNumber,arrayOfReel[reel],arrayOfReel[reel].length, reel, col);
                        viewZone[`reel${reel}`].push(symbol);
                    }
                    generatedArray.push(viewZone[`reel${reel}`])
                }
                
                //create Reel X colume matrix
                let matrixReelXCol = [];
                for (let matrixCol = 0; matrixCol < 3; matrixCol++) {
                    let arrar = [];           
                    
                    for (let matrixRow = 0; matrixRow < 5; matrixRow++) {
                        let num = generatedArray[matrixRow][matrixCol];
                        arrar[matrixRow] = num;
                    }            
                    matrixReelXCol.push(arrar);                      
                } 
                console.log(matrixReelXCol);
                let d = 0;
                let payarray =this.payarray();
                let sactterCount = 0;
                
                // in matrix check payline available 
                for (let rowOfMatrix = 0; rowOfMatrix < matrixReelXCol.length; rowOfMatrix++) {
                    for (let rowOfPayArray = 0; rowOfPayArray < payarray.length; rowOfPayArray++) { 
                        let symbol = matrixReelXCol[rowOfMatrix][d];             
                        let payline = payarray[rowOfPayArray];
                        let count = 0;
                        if(payline[0] === rowOfMatrix && symbol !== 'SCATTER'){
                            count++;
                            for (let element = 1; element < payline.length; element++) {
                                if (symbol === 'WILD' && matrixReelXCol[payline[element]][element] !== 'SCATTER'){
                                    symbol = matrixReelXCol[payline[element]][element];
                                    count++;
                                    continue;
                                }
                                if (matrixReelXCol[payline[element]][element] != 'WILD' && matrixReelXCol[payline[element]][element] != symbol){
                                    break;
                                }
                                count++;
                            }
                            
                            if (count > 2){
                                if (symbol === 'WILD'){
                                    break ;
                                }
                                let Pay = this.paytable();
                                let multipler = Pay[`${symbol}`][`${count}ofakind`];
                                if(freeSpin > 0){
                                    WinFreeSpinAmount =this.creditWinAmount(multipler,betAmount,WinFreeSpinAmount);
                                }
                                wallet += betAmount * multipler ;
                                result.push({symbol,wintype : `${count}ofakind`,Payline : payline ,WinAmount : betAmount * multipler})  
                            }
                            
                        }
                        let checkScatter= matrixReelXCol[rowOfMatrix][rowOfPayArray];
                        //checkScatter
                        if (checkScatter === 'SCATTER' ){
                            sactterCount++;
                        }
                    }
                }
                // free spin counting and free spin not occurred
                if(freeSpin != 0){
                    freeSpin--;
                }else{
                    wallet = this.debitWinAmount(wallet,betAmount);
                    WinFreeSpinAmount =0;
                }
                
                //when free spin given
             
                if (sactterCount > 2) {
                    if(freeSpin > 0){
                        totalfreeSpin += 3 ;
                        freeSpin += 3; 
                    }else{
                        freeSpin =5 ;
                        totalfreeSpin = freeSpin;
                    }
                    
                }

                let scatterOffreeSpin = this.freeSpin(freeSpin,WinFreeSpinAmount,totalfreeSpin);
                
                reslt.content.wallet = wallet;
                reslt.content.betAmount = betAmount;
                reslt.content.freeSpin = freeSpin;
                reslt.content.WinFreeSpinAmount = WinFreeSpinAmount;
                reslt.content.totalfreeSpin = totalfreeSpin;
                couchbaseCollection.upsert( reslt.content.email,reslt.content);

                
                res.send({
                    viewZone  : viewZone,
                    result    : result,
                    betAmount : betAmount, 
                    wallet    : wallet,
                    freeSpin  : freeSpin > 0 ? scatterOffreeSpin : 0 
                }) 
            }
        });
                   
    }
}

const slotGameObj = new SlotGame();
module.exports.slotGame= slotGameObj
