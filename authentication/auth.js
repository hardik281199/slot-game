const UUID = require('uuid');
const { couchbaseCollection } = require('../connection/con');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
class Auth {

    /**
     * Create Account
     * add new account in data base
     * @param {*} req request data 
     * @param {*} res responce result 
     */
    register(req, res) {
        
        let id = UUID.v4();
        const account = {
            "User_Id": id,
            "email": req.body.email,
            "password": Bcrypt.hashSync(req.body.password, 10),
            "wallet" : 200000,
            "betAmount" : 100 ,
            "freeSpin"  : 0,
            "WinFreeSpinAmount" : 0
        }
        couchbaseCollection.get(req.body.email,account,(err,reslt)=>{
            if(reslt){
                return res.status(401).send({ "success": false, "message": "This `Email Id` exists" });
            }else{
                couchbaseCollection.insert(req.body.email, account, (error, result) => {
                    if (error) {
                        return res.status(500).send({});
                    }
                    res.send({"message" : "You have been registered successfully"});
                });
            }
        })
        
    }

    /**
     * login
     * @param {request} req request data 
     * @param {Response} res response Token
     */
    login(req, res) {

        couchbaseCollection.get(req.body.email,(error,account) =>{
            
            if(!account) {
                return res.status(500).send({"message": "User not foundPlease register first You are not registered"});
            }
            Bcrypt.compare(req.body.password,account.value.password ,(error,result)=>{
                if(error || !result) {
                    return res.status(401).send({ "success": false, "message": "Invalid username and password" });
                }
                const json = {
                    id : account.content.User_Id,
                    email : account.content.email
                }
                let token = JsonWebToken.sign(json, process.env.JWT_SECRET);
                account.content.jwt = token;

                couchbaseCollection.upsert(json.email,account.content)
                res.send({"token": token});
                
            })
        })

    }

    /**
     * logout and jwt token expire
     * @param {Request} req request data 
     * @param {Response} res response success message
     */
    logout(req,res){
        couchbaseCollection.get(req.token.email,(error,result)=>{
            delete result.content.jwt;
            couchbaseCollection.upsert(req.token.email,result.content);
        });
        res.send({"message" : "logOut success"})
    }

}

const authObj = new Auth();
module.exports.auth = authObj;