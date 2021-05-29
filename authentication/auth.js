const UUID = require('uuid');
const { bucket }  = require('../connection/con');
const JsonWebToken = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
class Auth{

    register(req,res){
        console.log(bucket._cluster, 'dsfdsfdss');
        var id = UUID.v4();
        req.body.type = "logddin";
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
        console.log(bucket +"  this bucket");
        bucket.insert(`user::${id}`,{
            "type" : req.body.type,
            "username" : req.body.username,
            "password" : req.body.password
            }, (error, result) => {
                 
            // if(error) {
            //     return res.status(500).send({});
            // }
            // res.send(result);
        });
    }

    

}


const authObj = new Auth();
module.exports.auth= authObj;