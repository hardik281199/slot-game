
const { falshMessage } = require('../Dispatcher/responseDispatcher');

class Verify{

    /**
     * verify credentials for user
     * @param {Request} req request data
     * @param {Response} res responce message
     * @param {next} next if valid insert data then fire next function
     * @returns return message
     */
    credentialVerify(req,res,next){

        const email = req.body.email;
        const password = req.body.password;
        var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!emailFormat.exec(email)){
            let response = falshMessage.resDispatchError(res,'INVALID_EMAIL');
            return response;
        }else if( !passwordFormat.exec(password)){
            let response = falshMessage.resDispatchError(res,'INVALID_PASSWORD');
            return response;
        }else if (!email){
            let response = falshMessage.resDispatchError(res,'REQUIRE_EMAIL');
            return response;
        }else if(!password){
            let response = falshMessage.resDispatchError(res,'REQUIRE_PASSWORD');
            return response;
        }else{
            next();
        }
    }

}

const credentialVerify = new Verify();
module.exports.verify = credentialVerify;