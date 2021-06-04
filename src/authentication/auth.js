const UUID = require('uuid');
const {getObject , upsertObject } = require('../connection/con');
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
        
        const account = {
            "email": req.body.email,
            "password": Bcrypt.hashSync(req.body.password, 10),
            "wallet" : 200000,
            "betAmount" : 100 ,
            "freeSpin"  : 0,
            "WinFreeSpinAmount" : 0,
            "totalfreeSpin" : 0
        }
        getObject(req.body.email).then((reslt)=>{
            if(reslt){
                return res.status(401).send({ "success": false, "message": "This `Email Id` exists" });
            }else{
                upsertObject(req.body.email, account).then(() => {
                    res.send({"message" : "You have been registered successfully"});
                }).catch(err => {
                    res.send({ message: 'You not register , please try again' });
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

        getObject(req.body.email).then((account) =>{
            
            if(!account) {
                return res.status(500).send({"message": "User not foundPlease register first You are not registered"});
            }
            Bcrypt.compare(req.body.password,account.value.password ,(error,result)=>{
                if(error || !result) {
                    return res.status(401).send({ "success": false, "message": "Invalid username and password" });
                }
                const json = {
                    email : account.content.email
                }
                let token = JsonWebToken.sign(json, process.env.JWT_SECRET);
                account.content.jwt = token;

                upsertObject(json.email,account.content).then( () =>{
                    res.send({"token": token});
                });
                
                
            })
        })

    }

    /**
     * logout and jwt token expire
     * @param {Request} req request data 
     * @param {Response} res response success message
     */
    logout(req,res){
            getObject(req.token.email).then((result)=>{
            delete result.content.jwt;
            upsertObject(req.token.email,result.content).then( () =>{
                res.send({"message" : "logOut success"});
            }).catch(err => {
                res.send({ message: 'you not logOut' });
            });
        });
        
    }

}

const authObj = new Auth();
module.exports.auth = authObj;