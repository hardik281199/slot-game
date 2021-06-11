class GameFunction{
    gameFunction(req,res) {
        const account = {
            email: req.body.email,
            password: Bcrypt.hashSync(req.body.password, 10),
            wallet: 200000,
            betAmount: 100 ,
            freeSpin: 0,
            WinFreeSpinAmount: 0,
            totalfreeSpin: 0
        }

        return account;
    }
}
const game = new GameFunction();
module.exports.game = game ;