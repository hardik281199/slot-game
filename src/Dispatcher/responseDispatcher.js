const { RES_MESSAGES } = require('./message.json');

class Dispatcher {
    
    resDispatch(res,message,data){
        
        let jsonResponse ={
            "isError" : true,
            "message" : RES_MESSAGES[`${message}`],
            "data" :data
        }
        res.send (jsonResponse);
        return true;
    }

    resDispatchError(res,message){
        let jsonResponse ={
            "isError" : false,
            "message" : RES_MESSAGES[`${message}`],
            "data" : {}
        }
        res.send (jsonResponse);
        return false
    }
}

const resDispatch = new Dispatcher();
module.exports.falshMessage = resDispatch;
