
const { couchbaseCollection, getObject , upsertObject } = require('../connection/con');
const { gameHelper } = require('../utils/gamehelper');
const { falshMessage } = require('../dispatcher/responseDispatcher');

class SlotGame {

    /**
     * calculation of match payline and return json data,win amount
     * @param {*} req 
     * @param {*} res 
     */
    gameFunction = (req, res) => {
        getObject(req.token.email).then((reslt) =>{
            if (!reslt.content.jwt){
                let response = falshMessage.resDispatchError(res,'FAILED_AUTHENTICATION');
                return response;
            }else {
                let wallet = reslt.content.wallet;
                let betAmount = reslt.content.betAmount;
                let freeSpin = reslt.content.freeSpin;
                let WinFreeSpinAmount = reslt.content.WinFreeSpinAmount;
                let totalfreeSpin = reslt.content.totalfreeSpin; 
                
                const randomNumber = gameHelper.randomInt(0,9);
                getObject("MyJackpot").then((gameVariable) =>{
                    const arrayOfReel = gameVariable.content.static.arrayOfReel;
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
                            const symbol = gameHelper.getSymbol(randomNumber,arrayOfReel[reel],arrayOfReel[reel].length, reel, col);
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
                    //console.log(matrixReelXCol);
                    let d = 0;
                    const payarray = gameVariable.content.static.payarray;
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
                                    let Pay = gameVariable.content.static.payTable;
                                    let multipler = Pay[`${symbol}`][`${count}ofakind`];
                                    if(freeSpin > 0){
                                        WinFreeSpinAmount =gameHelper.creditWinAmount(multipler,betAmount,WinFreeSpinAmount);
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
                        wallet = gameHelper.debitWinAmount(wallet,betAmount);
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

                    let scatterOffreeSpin = gameHelper.freeSpin(freeSpin,WinFreeSpinAmount,totalfreeSpin);
                    
                    reslt.content.wallet = wallet;
                    reslt.content.betAmount = betAmount;
                    reslt.content.freeSpin = freeSpin;
                    reslt.content.WinFreeSpinAmount = WinFreeSpinAmount;
                    reslt.content.totalfreeSpin = totalfreeSpin;
                    couchbaseCollection.upsert( reslt.content.email,reslt.content);
                    upsertObject(reslt.content.email,reslt.content).then(()=>{

                    }).catch(err => {
                        let response = falshMessage.resDispatchError(res,'NOT_FOUND');
                        return response;
                    });
                    let data = {
                        viewZone  : viewZone,
                        result    : result,
                        betAmount : betAmount, 
                        wallet    : wallet,
                        freeSpin  : freeSpin > 0 ? scatterOffreeSpin : 0 
                    }
                    let response = falshMessage.resDispatch(res,'OK',data);
                    return response;
                    
                }) 
            }
        });
                   
    }
}

const slotGameObj = new SlotGame();
module.exports.slotGame= slotGameObj
