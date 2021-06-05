const UUID = require('uuid');
const {couchbaseCollection ,getObject , upsertObject } = require('../connection/con');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
const { falshMessage } = require('../Dispatcher/responseDispatcher');

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
        couchbaseCollection.get(req.body.email,(error,reslt) => {
            if(reslt){
                let response = falshMessage.resDispatchError(res,'EXISTS');
                return response;
            }else{
                upsertObject(req.body.email, account).then((result) => {
                    let response = falshMessage.resDispatch(res,'REGISTRATION',result);
                    return response;
                }).catch(err => {   
                    let response = falshMessage.resDispatchError(res,'SOMETHING_WENT_WRONG');
                    return response;
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
                let response = falshMessage.resDispatchError(res,'FIRST_REG');
                return response;
            }
            Bcrypt.compare(req.body.password,account.value.password ,(error,result)=>{
                if(error || !result) {
                    let response = falshMessage.resDispatchError(res,'INVALID');
                    return response;
                }
                const json = {
                    email : account.content.email
                }
                let token = JsonWebToken.sign(json, process.env.JWT_SECRET);
                account.content.jwt = token;

                upsertObject(json.email,account.content).then( () =>{
                    let response = falshMessage.resDispatch(res,'USER_LOGIN',{"token": token});
                    return response;
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
                let response = falshMessage.resDispatch(res,'USER_LOGOUT');
                return response;
            }).catch(err => {
                let response = falshMessage.resDispatchError(res,'SOMETHING_WENT_WRONG');
                return response;
            });
        });
        
    }

}

const authObj = new Auth();
module.exports.auth = authObj;