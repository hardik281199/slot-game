
const { getObject , upsertObject } = require('../connection/con');
const { gameHelper } = require('../utils/gameHelper');
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
                let response = falshMessage.resDispatchUnAuthorize(res,'FAILED_AUTHENTICATION');
                return response;
            }else {
                let { wallet,betAmount,freeSpin,WinFreeSpinAmount,totalfreeSpin,winInSpin,wildMultipliar } = reslt.content;
                if(winInSpin === 0){
                    getObject("MyJackpot").then((gameVariable) =>{
                        // Generate ViewZone
                        const generateViewZone = gameHelper.generateViewZone(gameVariable.content);
                        const viewZone = generateViewZone.viewZone;
                        const expanding_Wild = gameHelper.expandingWildCard(generateViewZone,gameVariable.content.wildMult);
                        wildMultipliar = expanding_Wild.wildMultipliar;
                        //create Reel X colume matrix
                        let matrixReelXCol = gameHelper.matrix(expanding_Wild,gameVariable.content.viewZone.rows , gameVariable.content.viewZone.columns)
    
                        // in matrix check payline available 
                        let checkPayline = gameHelper.checkPayline(gameVariable.content.payarray,matrixReelXCol,reslt.content,gameVariable.content.payTable,expanding_Wild.checkDevil);
                        WinFreeSpinAmount = checkPayline.WinFreeSpinAmount;
                        wallet = checkPayline.wallet;
                        winInSpin = checkPayline.winAmount;
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
                        let result =checkPayline.result;
                        
                        reslt.content.wallet = wallet;
                        reslt.content.betAmount = betAmount;
                        reslt.content.freeSpin = freeSpin;
                        reslt.content.WinFreeSpinAmount = WinFreeSpinAmount;
                        reslt.content.totalfreeSpin = totalfreeSpin;
                        reslt.content.winInSpin = winInSpin;
                        reslt.content.wildMultipliar = wildMultipliar
                        upsertObject(reslt.content.email,reslt.content).then(()=>{}).catch(err => {
                            let response = falshMessage.resDispatchNotFound(res,'NOT_FOUND');
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
                    });
                }else{
                    let response = falshMessage.resDispatchError(res,'GAMBLE_ERROR');
                    return response;
                }
            }
        });            
    }

    /**
     * counting gamble 
     * @param {req} req 
     * @param {res} res 
     */
    gameble =(req,res) =>{
        getObject(req.token.email).then((result) =>{
            let { winInSpin,gamblecounter,gambleWin,gamble_history} = result.content;
            if (result.content.winInSpin !== 0) {
                
                getObject("MyJackpot").then((gameVariable) =>{
                    if(gameVariable.content.maxWinAmount >= winInSpin){
                        let gambleResponse = gameHelper.conutGamble(req,result,gameVariable);
                        winInSpin = gambleResponse.winInSpin;
                        gamblecounter = gambleResponse.gamblecounter;
                        gambleWin = gambleResponse.gambleWin;
                        gamble_history = gambleResponse.gamble_history;
                        
                        result.content.gamble_history = gamble_history;
                        result.content.winInSpin = winInSpin ;
                        result.content.gamblecounter = gamblecounter;
                        result.content.gambleWin = gambleWin;
                        upsertObject(result.content.email,result.content).then(()=>{}).catch(err => {
                            let response = falshMessage.resDispatchNotFound(res,'NOT_FOUND');
                            return response;
                        });

                        let data ={
                            GambleWinTriggered : gambleResponse.winInSpin ==0 ? false : true,
                            gambleResponse
                        }
                        let response = falshMessage.resDispatch(res,'OK',data);
                        return response;
                    }else{
                        let response = falshMessage.resDispatchError(res,'GAMBLE_FINISH');
                        return response;
                    } 
                });
            }else{
                let response = falshMessage.resDispatchError(res,'GAMBLE_RES');
                return response;
            }
            
        })
    }

    /**
     * collect win amount
     * @param {Request} req 
     * @param {response} res 
     */
    collect =(req,res) =>{
        getObject(req.token.email).then((result) =>{
            let {wallet, winInSpin, gamblecounter, wildMultipliar} = result.content;
            if (result.content.winInSpin !== 0) {
                
                let collectWallet = gameHelper.collectWallet(result);
                wallet = collectWallet.wallet;
                winInSpin = collectWallet.winInSpin;
                gamblecounter = collectWallet.gamblecounter;
                wildMultipliar = collectWallet.wildMultipliar;

                result.content.wildMultipliar = wildMultipliar;
                result.content.winInSpin = winInSpin;
                result.content.wallet = collectWallet.wallet;
                result.content.gamblecounter = collectWallet.gamblecounter;
                upsertObject(result.content.email,result.content).then(()=>{}).catch(err => {
                    let response = falshMessage.resDispatchNotFound(res,'NOT_FOUND');
                    return response;
                });

                let data ={
                    wallet : wallet,
                    gambleWin : collectWallet.gambleWin > 0 ? true : false
                }
                let response = falshMessage.resDispatch(res,'OK',data);
                return response;
            }else{
                let response = falshMessage.resDispatchError(res,'COLLECT_RES');
                return response;
            }
        })
    }
}

const slotGameObj = new SlotGame();
module.exports.slotGame= slotGameObj
