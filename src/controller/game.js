
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
                console.log(wallet);
                let betAmount = reslt.content.betAmount;
                let freeSpin = reslt.content.freeSpin;
                let WinFreeSpinAmount = reslt.content.WinFreeSpinAmount;
                let totalfreeSpin = reslt.content.totalfreeSpin; 
                
                const randomNumber = gameHelper.randomInt(0,9);
                getObject("MyJackpot").then((gameVariable) =>{

                    
                    const generateViewZone = gameHelper.generateViewZone(randomNumber,gameVariable.content.static);
                    const viewZone = generateViewZone.viewZone;
                    
                    //create Reel X colume matrix
                    let matrixReelXCol = gameHelper.matrix(generateViewZone,gameVariable.content.static.viewZone.rows , gameVariable.content.static.viewZone.columns)
                    //console.log(matrixReelXCol);

                    let sactterCount = 0; 
                    // in matrix check payline available 
                    let checkPayline = gameHelper.checkPayline(gameVariable.content.static.payarray,matrixReelXCol,reslt.content,gameVariable.content.static.payTable);
                    console.log(checkPayline);
                    sactterCount = checkPayline.sactterCount;
                    console.log(checkPayline.wallet + "   this is wallet");
                    let result =checkPayline.result[0];
                    if (!checkPayline.wallet){
                        wallet = checkPayline.wallet;
                        WinFreeSpinAmount = checkPayline.WinFreeSpinAmount;
                    }
                    
                    // free spin counting and free spin not occurred
                    if(freeSpin != 0){
                        freeSpin--;
                    }else{
                        wallet = gameHelper.debitWinAmount(wallet,reslt.content.betAmount);
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
