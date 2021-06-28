const { cluster,upsertObject,getObject } = require('../connection/con');
const { falshMessage } = require('../dispatcher/responseDispatcher');
const { DBDocType } = require('../configuration/constants');
const { mapper } = require('../mapper/game');

class Seeder {

    /**
     * static data of game and store data in data base 
     * check if game all ready store in data base then send error response
     * @param {Request} req 
     * @param {response} res 
     */
    addGameObject(req,res){
        const gameVariable = req.body;
        getObject(req.body.gameName).then((reslt) =>{
            if(reslt){
                let response = falshMessage.resDispatchError(res,'GAME_EXISTS');
                return response;
            }
        }).catch(error =>{
            let docType = DBDocType.GAME;
            let createdAt = Date.now();
            gameVariable.docType = docType ;
            gameVariable.createdAt = createdAt ;
            gameVariable.deletedAt = 0;
            gameVariable.updateAt = 0;
            upsertObject(req.body.gameName,gameVariable).then((result) =>{
                const mapData = mapper.gameConfigeEditUpdateDelete(gameVariable);
                let response = falshMessage.resDispatch(res,'GAME_DATA',mapData);
                return response;
            }).catch(err => {
                let response = falshMessage.resDispatchError(res,'UNSUCCESS');
                return response;
            });
        })
        
    }

    /**
     * this function use edit Game_config data
     * @param {Request} req request
     * @param {response} res response
     * @returns message 
     */
    editGameObject(req,res){
        const gameVariable = req.body;
        getObject(req.body.gameName).then((reslt) =>{
            console.log(reslt);
            if ( req.params.gameName ===  gameVariable.gameName){
                if(!req.body.createdAt){
                    gameVariable.updateAt = Date.now();
                    gameVariable.createdAt = reslt.content.createdAt;
                    gameVariable.deletedAt = reslt.content.deletedAt;
                    upsertObject(req.body.gameName,gameVariable).then((result) =>{
                        const mapData = mapper.gameConfigeEditUpdateDelete(gameVariable);
                        let response = falshMessage.resDispatch(res,'GAME_DATA',mapData);
                        return response;
                    }).catch(err => {
                        let response = falshMessage.resDispatchError(res,'UNSUCCESS');
                        return response;
                    });
                }else{
                    let response = falshMessage.resDispatchError(res,'CREATEDAT_NOT_CHANGE');
                    return response;
                }
                
            }else{
                let response = falshMessage.resDispatchError(res,'GAMENAME_NOT_CHANGE');
                return response;
            }
        }).catch(error =>{
            let response = falshMessage.resDispatchError(res,'NOT_FOUND');
            return response;
        })
    }

    /**
     * this function Softdelete game GameObject 
     * @param {Request} req 
     * @param {response} res 
     */
    deletGameObject(req,res){
        getObject(req.params.gameName).then((result) =>{
            if(result.content.deletedAt === 0){
                result.content.deletedAt = Date.now();
                upsertObject(result.content.gameName,result.content).then((result) =>{
                    let response = falshMessage.resDispatch(res,'DELETE_GAMECONFIG');
                    return response;
                });
            }else{
                let response = falshMessage.resDispatchError(res,'ALL_READY_DELETED');
                return response;
            }
            
        }).catch(error =>{
            let response = falshMessage.resDispatchError(res,'NOT_GAME_EXISTS');
            return response;
        })
    }

    /**
     * this function use to get all game and listing all game .
     * @param {Request} req 
     * @param {response} res 
     */
    getAllGame = (req,res) =>{
        cluster.query("SELECT * FROM `slot-game` as games WHERE docType='game' and deletedAt == 0", (err, rows) => {
            if(err){
                let response = falshMessage.resDispatchError(res,'ERROR');
                return response;
            }else{
                const mapData = mapper.AllgameConfig(rows.rows);
                let response = falshMessage.resDispatch(res,'OK',mapData);
                return response;
            }
        });
     }
}


const seeder = new Seeder();
module.exports.gameConfig = seeder;
