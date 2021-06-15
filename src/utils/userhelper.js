const Bcrypt = require('bcrypt');
class GameFunction{

    /**
     * this function use where first time register user  
     * @param {req} req 
     * @param {res} res 
     * @returns account detail
     */
    gameFunction(req,res) {
        const account = {
            email: req.body.email,
            password: Bcrypt.hashSync(req.body.password, 10),
            wallet: 200000,
            betAmount: 100 ,
            freeSpin: 0,
            WinFreeSpinAmount: 0,
            totalfreeSpin: 0,
            winInSpin : 0,
            gamblecounter : 0,
            gambleWin :0,
            gamble_history :[]
        }
        return account;
    }
}
const game = new GameFunction();
module.exports.game = game ;