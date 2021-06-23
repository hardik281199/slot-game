const { upsertObject } = require('../connection/con');
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
        upsertObject(req.body.gameName,gameVariable).then((result) =>{
            let response = falshMessage.resDispatch(res,'GAME_DATA',{gameVariable});
            return response;
        }).catch(err => {
            let response = falshMessage.resDispatchError(res,'UNSUCCESS');
            return response;
        });
    }
}


const seeder = new Seeder();
module.exports.gameConfig = seeder;
