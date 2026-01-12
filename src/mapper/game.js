const { gameVariable } = require("../seeder/gameData");

class Mapper{
    /**
     * this function give proper response  to all GameConfig 
     * @param {rows} rows 
     * @returns 
     */
    allGameConfig = (rows , page , totalGame , perPage) =>{
        const gameConfig = [];
        let totalPage = Math.ceil(totalGame / perPage);
        rows.forEach(function(data) {
            let { gameName,viewZone,payarray,payTable,arrayOfReel,maxWinAmount } = data.games;
            const dataOfGameConfig = { gameName , viewZone , payarray , payTable , arrayOfReel, maxWinAmount }
            gameConfig.push(dataOfGameConfig);
        });
        return {gameConfig, page ,totalGame  , totalPage ,perPage};
    }

    /**
     * this function give proper response to edit , update , delete gameConfig 
     * @param {gameVariable} gameVariable 
     * @returns 
     */
    gameConfigeEditUpdateDelete = (gameVariable) =>{
        let { gameName,viewZone,payarray,payTable,arrayOfReel,maxWinAmount } = gameVariable;
        const gameConfig = { gameName , viewZone , payarray , payTable , arrayOfReel, maxWinAmount }
        return gameConfig;
    }

}

const map = new Mapper();
module.exports.mapper = map;