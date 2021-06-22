const { upsertObject } = require('../connection/con');
const { falshMessage } = require('../dispatcher/responseDispatcher');
const { gameVariable } = require('./gameData')

class Seeder {

    /**
     * static data of game
     * @param {Request} req 
     * @param {response} res 
     */
    seedGameObject(req,res){
        // console.log("hii" + gameVariable );
        upsertObject('MyJackpot',gameVariable).then((result) =>{
            console.log(" Game has been seeded successfully!");
            let response = falshMessage.resDispatch(res,'SUCCESS',{});
            return response;
        }).catch(err => {
            let response = falshMessage.resDispatchError(res,'UNSUCCESS');
            return response;
        });
    }
}


const seeder = new Seeder();
module.exports.gameConfig = seeder;