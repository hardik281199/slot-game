const { upsertObject,getObject } = require('../connection/con');
const { falshMessage } = require('../dispatcher/responseDispatcher');
// const { gameVariable } = require('./gameData')

class Seeder {

    /**
     * static data of game
     * @param {Request} req 
     * @param {response} res 
     */
    seedGameObject(req,res){
        const gameVariable = req.body;
        getObject(req.body.gameName).then((reslt) =>{
            if(reslt){
                GAME_EXISTS
                let response = falshMessage.resDispatchError(res,'GAME_EXISTS');
                return response;
            }else{
                upsertObject(req.body.gameName,gameVariable).then((result) =>{
                    let response = falshMessage.resDispatch(res,'GAME_DATA',{gameVariable});
                    return response;
                }).catch(err => {
                    let response = falshMessage.resDispatchError(res,'UNSUCCESS');
                    return response;
                });
            }
        })
        
    }

    editGameObject(req,res){
        const gameVariable = req.body;
        log(gameVariable);
    }
}


const seeder = new Seeder();
module.exports.gameConfig = seeder;
