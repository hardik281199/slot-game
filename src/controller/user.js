const { couchbaseCollection, getObject } = require('../connection/con');
const { falshMessage } = require('../dispatcher/responseDispatcher');
class UserDetails {
    userDetails = (req, res) => {
        couchbaseCollection.get(req.token.email, (error, result) => {
            const wallet = result.content.wallet;
            const betAmount = result.content.betAmount;
            const freeSpin = result.content.freeSpin;
            const WinFreeSpinAmount = result.content.WinFreeSpinAmount;

            let data ={
                "wallet": wallet,
                "betAmount": betAmount,
                "freeSpin": freeSpin,
                "WinFreeSpinAmount": WinFreeSpinAmount
            };
            let response = falshMessage.resDispatch(res,'USER_DETAILS',data);
            return response;
        });
    }

    getUserDetailsWithPromise = (req, res) => {
        /**
         * Promise with then() & catch()
         */
        getObject(req.token.email).then((result) => {
            const wallet = result.content.wallet;
            const betAmount = result.content.betAmount;
            const freeSpin = result.content.freeSpin;
            const WinFreeSpinAmount = result.content.WinFreeSpinAmount;
            let winInSpin = result.content.winInSpin;
            let gamblecounter = result.content.gamblecounter;
            let gambleWin = result.content.gambleWin;
            let gamble_history = result.content.gamble_history;

            let data ={
                "wallet": wallet,
                "betAmount": betAmount,
                "freeSpin": freeSpin,
                "WinFreeSpinAmount": WinFreeSpinAmount,
                "winInSpin" : winInSpin,
                "gamblecounter" : gamblecounter,
                "gambleWin" : gambleWin,
                "gamble_history " : gamble_history
            };
            let response = falshMessage.resDispatch(res,'USER_DETAILS',data);
            return response;
        }).catch(err => {
            let response = falshMessage.resDispatchError(res,'SOMETHING_WENT_WRONG');
                return response;
        });

    }

    getUserDetailsWithAwait = async (req, res) => {
        /**
         * Promise with await
         */
        const user = await getObject(req.token.email);
        const wallet = user.content.wallet;
        const betAmount = user.content.betAmount;
        const freeSpin = user.content.freeSpin;
        const WinFreeSpinAmount = user.content.WinFreeSpinAmount;

        let data ={
            "wallet": wallet,
            "betAmount": betAmount,
            "freeSpin": freeSpin,
            "WinFreeSpinAmount": WinFreeSpinAmount
        };
        let response = falshMessage.resDispatch(res,'USER_DETAILS',data);
        return response;
    }

}

const userDetails = new UserDetails();
module.exports.user = userDetails;