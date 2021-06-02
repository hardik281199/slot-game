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
            return res.status(401).send({ "message": "Please Enter valid email " })
        }else if( !passwordFormat.exec(password)){
            return res.status(401).send({ "message": "Please Enter valid password " })
        }else if (!email){
            return res.status(401).send({ "message": "An `email` is required" })
        }else if(!password){
            return res.status(401).send({ "message": "A `password` is required" })
        }else{
            next();
        }
    }

}

const credentialVerify = new Verify();
module.exports.verify = credentialVerify;