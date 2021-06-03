const { couchbaseCollection } = require('../connection/con');
class UserDetails{
    userDetails =(req,res) =>{
        couchbaseCollection.get(req.token.email,(error,result)=>{
            const wallet = result.content.wallet;
            const betAmount = result.content.betAmount;
            const freeSpin = result.content.freeSpin;
            const WinFreeSpinAmount = result.content.WinFreeSpinAmount;

            res.send({
                "wallet" : wallet,
                "betAmount" : betAmount,
                "freeSpin" : freeSpin,
                "WinFreeSpinAmount" : WinFreeSpinAmount
            })
        });

        
    }
}

const userDetails = new UserDetails();
module.exports.user = userDetails;