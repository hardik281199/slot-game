const { slotGame } = require('../controller/game');
const { user } = require('../controller/user');
const { auth } = require('../authentication/auth');
const { verifyToken } = require('../middleware/verifyToken');
const { verify } = require('../middleware/credentialsVerify');
const { gameConfig } = require('../seeder/seeder');
const { gameValidator } = require('../middleware/verifyAPI')

module.exports = (app) => {

    app.post('/login', verify.credentialVerify, auth.login);

    app.post('/register', verify.credentialVerify, auth.register);

    app.post('/spin', verifyToken.checkToken, slotGame.gameFunction);

    app.post('/logout', verifyToken.checkToken, auth.logout);

    app.get('/userinfo', verifyToken.checkToken, user.getUserDetailsWithPromise);

    app.post('/games',gameValidator.gameConfig,gameConfig.addGameObject);

    app.put('/games/:gameName',gameValidator.editGameConfig,gameConfig.editGameObject);

    app.delete('/games/:gameName',gameConfig.deletGameObject);

    app.get('/games',gameConfig.getAllGame);

    app.get('/games/:gameName',gameConfig.gameGame);

    app.post('/allGame',gameConfig.indexing);

    app.post('/gamble', verifyToken.checkToken,slotGame.gameble);

    app.post('/collect', verifyToken.checkToken,slotGame.collect)

}