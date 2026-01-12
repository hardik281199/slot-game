const { cluster,upsertObject,getObject ,couchbaseN1QLCollection } = require('../connection/con');
const { falshMessage } = require('../dispatcher/responseDispatcher');
const { DBDocType } = require('../configuration/constants');
const { mapper } = require('../mapper/game');

class GameConfig{

    /**
     * static data of game and store data in data base 
     * check if game all ready store in data base then send error response
     * @param {Request} req 
     * @param {response} res 
     */
    addGameObject =(req,res) =>{
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
    editGameObject =(req,res) =>{
        const gameVariable = req.body;
        getObject(req.body.gameName).then((reslt) =>{
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
            let response = falshMessage.resDispatchNotFound(res,'NOT_FOUND');
            return response;
        })
    }

    /**
     * this function Softdelete game GameObject 
     * @param {Request} req 
     * @param {response} res 
     */
    deletGameObject =(req,res) =>{
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
            let response = falshMessage.resDispatchNotFound(res,'NOT_GAME_EXISTS');
            return response;
        })
    }

    /**
     * this function use to get all game and listing all game .
     * @param {Request} req 
     * @param {response} res 
     */
    getAllGame = (req,res) =>{
        couchbaseN1QLCollection("SELECT * FROM `slot-game` as games WHERE docType='game' and deletedAt == 0").then((rows) => {
            const mapData = mapper.allGameConfig(rows.rows);
            let response = falshMessage.resDispatch(res,'OK',mapData);
            return response;
            
        }).catch(err =>{
            let response = falshMessage.resDispatchError(res,'ERROR');
                return response;
        });
    }

    /**
     * this function use to indexing game and searching the game and provide pagination all data  
     * @param {Request} req 
     * @param {response} res 
     */
    indexing = (req,res) =>{
        let perPage = parseInt(req.query.pageSize);
        const page = parseInt(req.query.page) || 1;
        let offset = (page - 1) * perPage;
        let foundGameQuary = "SELECT * FROM `slot-game` as games WHERE docType = 'game' AND deletedAt == 0 "; 
        let countGameQuary = "SELECT COUNT(gameName) as totalGame FROM `slot-game` WHERE docType = 'game'";
        const paginateQuery = `limit ${perPage} OFFSET ${offset}`;
        if(req.query.gameName) {
            countGameQuary = countGameQuary + `AND lower(gameName) like lower('%${req.query.gameName}%')`;
            foundGameQuary = foundGameQuary + `AND lower(gameName) like lower('%${req.query.gameName}%')` + paginateQuery;
        } else {
            foundGameQuary = foundGameQuary + paginateQuery;
        }
        couchbaseN1QLCollection(countGameQuary).then((games) =>{
            couchbaseN1QLCollection(foundGameQuary).then((result) =>{

                let mapData = mapper.allGameConfig(result.rows , page,games.rows[0].totalGame , perPage);
                let response = falshMessage.resDispatch(res,'OK',mapData);
                return response;
            });
        });
    }

    /**
     * this function get specific game information.
     * @param {Request} req 
     * @param {response} res 
     */
    getGame = (req,res) =>{
        getObject(req.params.gameName).then((game) =>{
            let mapData = mapper.gameConfigeEditUpdateDelete(game.content);
            let response = falshMessage.resDispatch(res,'OK',mapData);
            return response;
        });
    }
}

const config = new GameConfig();
module.exports.gameConfig = config;