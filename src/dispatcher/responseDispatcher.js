const { RES_MESSAGES } = require('./message.json');

class Dispatcher {
    /**
     * This function dispatches api responses
     * @param {response} res send response
     * @param {message} message message_code
     * @param {data} data response data
     * @returns true
     */
    resDispatch(res,message,data){      
        let jsonResponse ={
            "isError" : true,
            "message" : RES_MESSAGES[`${message}`],
            "data" :data
        }
        res.send (jsonResponse);
        return true;
    }

    /**
     * This function dispatches error api responses
     * @param {responses} res send response
     * @param {message} message message_code
     * @returns false
     */
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
