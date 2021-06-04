const { couchbaseCollection, getObject } = require('../connection/con');
class UserDetails {
    userDetails = (req, res) => {
        couchbaseCollection.get(req.token.email, (error, result) => {
            const wallet = result.content.wallet;
            const betAmount = result.content.betAmount;
            const freeSpin = result.content.freeSpin;
            const WinFreeSpinAmount = result.content.WinFreeSpinAmount;

            res.send({
                "wallet": wallet,
                "betAmount": betAmount,
                "freeSpin": freeSpin,
                "WinFreeSpinAmount": WinFreeSpinAmount
            })
        });
    }

    getUserDetailsWithPromise = (req, res) => {
        /**
         * Promise with then() & catch()
         */
        getObject(req.body.email).then((result) => {
            const wallet = result.content.wallet;
            const betAmount = result.content.betAmount;
            const freeSpin = result.content.freeSpin;
            const WinFreeSpinAmount = result.content.WinFreeSpinAmount;

            res.send({
                "wallet": wallet,
                "betAmount": betAmount,
                "freeSpin": freeSpin,
                "WinFreeSpinAmount": WinFreeSpinAmount
            })
        }).catch(err => {
            console.log(err, 'User not found');
            res.send({ message: 'User not found' });
        });

    }

    getUserDetailsWithAwait = async (req, res) => {
        /**
         * Promise with await
         */
        const user = await getObject(req.body.email);
        const wallet = user.content.wallet;
        const betAmount = user.content.betAmount;
        const freeSpin = user.content.freeSpin;
        const WinFreeSpinAmount = user.content.WinFreeSpinAmount;

        res.send({
            "wallet": wallet,
            "betAmount": betAmount,
            "freeSpin": freeSpin,
            "WinFreeSpinAmount": WinFreeSpinAmount
        })
    }

}

const userDetails = new UserDetails();
module.exports.user = userDetails;