const  { slotGame } = require('../controller/game');
const { auth } = require('../authentication/auth');
const { verifyToken } = require('../middleware/verifyToken');
const { verify } = require('../middleware/credentialsVerify')

module.exports =(app) => {
    
    app.post('/login',verify.credentialVerify,auth.login);
    
    app.post('/register',verify.credentialVerify,auth.register);
    
    app.post('/spin',verifyToken.checkToken, slotGame.matrix);

    app.post('/logOut',verifyToken.checkToken,auth.logout)
}