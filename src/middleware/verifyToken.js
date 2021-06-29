const JsonWebToken = require('jsonwebtoken');
const { falshMessage } = require('../dispatcher/responseDispatcher');

class VerifyToken {

    /**
     * the process or action of verifying the identity of a user or process.
     * @param {Request} req request data
     * @param {Response} res response verifying message
     * @param {next} next if verifying action, then next event fire
     * @returns if valid then return message either return false 
     */
    checkToken (req,res,next){
        
        var authHeader = req.headers["authorization"];
        if(authHeader) {
            var bearerToken = authHeader.split(" ");
            if(bearerToken.length == 2 && bearerToken[0].toLowerCase() == "bearer") {
                JsonWebToken.verify(bearerToken[1],process.env.JWT_SECRET,(error, token) =>{
                    if(error) {
                        let response = falshMessage.resDispatchUnAuthorize(res,'FAILED_AUTHENTICATION');
                        return response;
                    }
                    req.token = token;
                    next();
        
                });
            } else{
                return false;
            }
        } else {
            let response = falshMessage.resDispatchUnAuthorize(res,'FAILED_AUTHENTICATION');
            return response;
        }
    }
}
const checkToken = new VerifyToken();
module.exports.verifyToken = checkToken;
