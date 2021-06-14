
const { getObject , upsertObject } = require('../connection/con');
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
                getObject("MyJackpot").then((gameVariable) =>{
                    // Generate ViewZone
                    const generateViewZone = gameHelper.generateViewZone(gameVariable.content.static);
                    const viewZone = generateViewZone.viewZone;
                    const expanding_Wild = gameHelper.expandingWildCard(generateViewZone);
                    
                    //create Reel X colume matrix
                    let matrixReelXCol = gameHelper.matrix(expanding_Wild,gameVariable.content.static.viewZone.rows , gameVariable.content.static.viewZone.columns)
                    //console.log(matrixReelXCol);

                    // in matrix check payline available 
                    let checkPayline = gameHelper.checkPayline(gameVariable.content.static.payarray,matrixReelXCol,reslt.content,gameVariable.content.static.payTable,expanding_Wild.wildMultipliar);
                    WinFreeSpinAmount = checkPayline.WinFreeSpinAmount;
                    wallet = checkPayline.wallet;
                    let checkfreeSpin = checkPayline.freeSpin
                     // free spin counting and free spin not occurred
                     if(freeSpin !== 0){
                        freeSpin--;
                        checkfreeSpin--;
                    }else{
                        wallet = gameHelper.debitWinAmount(checkPayline.wallet,reslt.content.betAmount);
                        WinFreeSpinAmount =0;
                    }

                    //when free spin given
                    if (checkPayline.sactterCount > 2) {
                        let countOfFreeSpin = gameHelper.countOfFreeSpin(freeSpin,totalfreeSpin);
                        freeSpin = countOfFreeSpin.freeSpin;
                        totalfreeSpin = countOfFreeSpin.totalfreeSpin;
                    }
                    let responceFreeSpin = {};
                    if (freeSpin === 0) {
                        responceFreeSpin = gameHelper.freeSpin(checkfreeSpin,checkPayline.WinFreeSpinAmount,totalfreeSpin);
                    }else {
                        responceFreeSpin = gameHelper.freeSpin(freeSpin,checkPayline.WinFreeSpinAmount,totalfreeSpin);
                    }
                    console.log(checkfreeSpin + "  this");
                    let result =checkPayline.result;
                    
                    reslt.content.wallet = wallet;
                    reslt.content.betAmount = betAmount;
                    reslt.content.freeSpin = freeSpin;
                    reslt.content.WinFreeSpinAmount = WinFreeSpinAmount;
                    reslt.content.totalfreeSpin = totalfreeSpin;
                    upsertObject(reslt.content.email,reslt.content).then(()=>{}).catch(err => {
                        let response = falshMessage.resDispatchError(res,'NOT_FOUND');
                        return response;
                    });
                    let data = {
                        viewZone  : viewZone,
                        result    : result,
                        betAmount : betAmount, 
                        wallet    : wallet,
                        freeSpin  : checkPayline.freeSpin > 0 ? responceFreeSpin : 0,
                        expandingWild : expanding_Wild.expandingWild,
                        TotalWin : checkPayline.winAmount,
                        wildMultipliar : expanding_Wild.wildMultipliarArray
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
