const JsonWebToken = require('jsonwebtoken');

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
                        return res.status(401).send("Invalid authorization token");
                    }
                    req.token = token;
                    next();
        
                });
            } else{
                return false;
            }
        } else {
            return false;
        }
    }
}
const checkToken = new VerifyToken();
module.exports.verifyToken = checkToken;
