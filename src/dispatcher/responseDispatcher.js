const { RES_MESSAGES ,HTTP_STATUS } = require('./message.json');

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
            "isError" : false,
            "message" : RES_MESSAGES[`${message}`],
            "data" :data
        }
        res.statusCode = HTTP_STATUS.OK;
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
            "isError" : true,
            "message" : RES_MESSAGES[`${message}`],
            "data" : {}
        }
        res.statusCode = HTTP_STATUS.VALIDATION_ERROR;
        res.send (jsonResponse);
        return false;
    }

    /**
     * this function use to NOT_FOUND data
     * @param {response} res 
     * @param {message} message 
     * @returns 
     */
    resDispatchNotFound(res,message){
        let jsonResponse ={
            "isError" : true,
            "message" : RES_MESSAGES[`${message}`],
            "data" : {}
        }
        res.statusCode = HTTP_STATUS.NOT_FOUND;
        res.send (jsonResponse);
        return false;
    }

    /**
     * this function send UNAUTHENTICATION token error
     * @param {response} res 
     * @param {message} message 
     * @returns 
     */
    resDispatchUnAuthorize(res,message){
        let jsonResponse ={
            "isError" : true,
            "message" : RES_MESSAGES[`${message}`],
            "data" : {}
        }
        res.statusCode = HTTP_STATUS.UNAUTHENTICATION;
        res.send (jsonResponse);
        return false;
    }


    /**
     * this function send proper response 
     * @param {response} res 
     * @param {data} jsonData 
     * @returns 
     */
    resDispatchJOIValidationError(res,jsonData){
        res.statusCode = HTTP_STATUS.VALIDATION_ERROR;
        res.send(jsonData);
        return false;
    }

}

const resDispatch = new Dispatcher();
module.exports.falshMessage = resDispatch;
