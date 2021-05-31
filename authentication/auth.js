const UUID = require('uuid');
const { couchbaseCollection } = require('../connection/con');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
class Auth {

    register(req, res) {
        // console.log(couchbaseCollection, 'dsfdsfdss');
        if (!req.body.email) {
            return res.status(401).send({ "message": "An `email` is required" })
        } else if (!req.body.password) {
            return res.status(401).send({ "message": "A `password` is required" })
        }
        let id = UUID.v4();
        const account = {
            "User_Id": id,
            "email": req.body.email,
            "password": Bcrypt.hashSync(req.body.password, 10)
        }
        couchbaseCollection.insert(req.body.email, account, (error, result) => {
            if (error) {
                return res.status(500).send({});
            }
            res.send(result);
        });
    }

    login(req,res) {
        if (!req.body.email) {
            return res.status(401).send({ "message": "An `email` is required" })
        } else if (!req.body.password) {
            return res.status(401).send({ "message": "A `password` is required" })
        }

        couchbaseCollection.get(req.body.email,(error,account) =>{
            console.log(account.content.User_Id);
            if(error) {
                return response.status(500).send({ code: error.code, message: error.message });
            }
            Bcrypt.compare(req.body.password,account.value.password ,(error,result)=>{
                if(error || !result) {
                    return response.status(401).send({ "success": false, "message": "Invalid username and password" });
                }
                let token = JsonWebToken.sign(account.content.User_Id, process.env.JWT_SECRET);
                res.send({"token": token});
            })
        })

    }

}


const authObj = new Auth();
module.exports.auth = authObj;