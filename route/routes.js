const  { slotGame } = require('../controller/game');
const { auth } = require('../authentication/auth');
const { verifyToken } = require('../middleware/verifyToken')

module.exports =(app) => {
    
    app.post('/login',auth.login);
    
    app.post('/register',auth.register);
    
    app.post('/spin',verifyToken.checkToken, slotGame.matrix);
}