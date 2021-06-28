const Bcrypt = require('bcrypt');
class GameFunction{

    /**
     * this function use where first time register user  
     * @param {req} req 
     * @param {res} res 
     * @returns account detail
     */
     buildUserData(req,res) {
        const account = {
            email: req.body.email,
            password: Bcrypt.hashSync(req.body.password, 10),
            wallet: 200000,
            betAmount: 100 ,
            freeSpin: 0,
            WinFreeSpinAmount: 0,
            totalfreeSpin: 0,
            wildMultipliar : 0,
            winInSpin : 0,
            gamblecounter : 0,
            gambleWin :0,
            gambleHistory :[]
        }
        return account;
    }
}
const user = new GameFunction();
module.exports.user = user ;