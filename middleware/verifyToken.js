const JsonWebToken = require('jsonwebtoken');
const app = import('express');
class VerifyToken {
    checkToken (req,res,next){
        // console.log(req);
        var authHeader = req.headers["authorization"];
        // console.log(app.get('goo') + " authHeader");
        if(authHeader) {
            var bearerToken = authHeader.split(" ");
            console.log(bearerToken + " bearerToken");
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
