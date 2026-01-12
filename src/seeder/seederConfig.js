const { upsertObject } = require('../connection/con');
const { falshMessage } = require('../dispatcher/responseDispatcher');
const { gameVariable } = require('./gameData');
const { DBDocType } = require('../configuration/constants');
const { mapper } = require('../mapper/game');

class GameConfig{

    /**
     * static data of game
     * @param {Request} req 
     * @param {response} res 
     */
    seedGameObject = () =>{
        const docType = DBDocType.GAME;
        const createdAt = Date.now();
        gameVariable.docType = docType ;
        gameVariable.createdAt = createdAt ;
        gameVariable.deletedAt = 0;
        gameVariable.updateAt = 0;
        upsertObject(gameVariable.gameName,gameVariable).then((result) =>{
            console.log("Myjackpot game seeded Successfully");
        }).catch(err => {
            console.log("error :" + err);
        });
    
    }
}


const seeder = new GameConfig();
seeder.seedGameObject();
