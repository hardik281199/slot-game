const Joi = require('joi');
const { falshMessage } = require('../dispatcher/responseDispatcher');

class GameValidator{

    /**
     * when game config add this middleware varify all req.body data using joi then next perform
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     * @returns message
     */
    gameConfig = (req,res,next) =>{
        const payObject = Joi.object().keys({
            "3ofakind": Joi.number().required(),
            "4ofakind": Joi.number().required(),
            "5ofakind": Joi.number().required()
            });
        const gameConfigSchema = Joi.object({
            gameName: Joi.string().min(3).max(15).required(),
            viewZone : Joi.object().keys({
                rows: Joi.number().valid(3).required(),
                columns : Joi.number().valid(5).required()
            }),
            payarray : Joi.array().items(Joi.array().items(Joi.number())).required(),
            payTable : Joi.object().keys({
                H1: payObject,
                H2: payObject,
                H3: payObject,
                A: payObject,
                K: payObject,
                J: payObject,
                SCATTER: payObject
            }),
            arrayOfReel : Joi.array().items(Joi.array().items(Joi.string())).required(),
            maxWinAmount : Joi.number()
        })
        const result = gameConfigSchema.validate(req.body);
        if(result.error){
            return falshMessage.resDispatchError(res, 'GAME_VARIABLE_ERROR');
        }else{
            return next();
        }
        
    }

    /**
     * when game config edit this middleware varify all req.body data using joi then next perform
     * @param {Request} req 
     * @param {Response} res 
     * @param {next} next 
     * @returns 
     */
    editGameConfig= (req,res,next) =>{
        const payObject = Joi.object().keys({
            "3ofakind": Joi.number().required(),
            "4ofakind": Joi.number().required(),
            "5ofakind": Joi.number().required()
            });
        const gameConfigSchema = Joi.object({
            gameName: Joi.string().min(3).max(15).required(),
            viewZone : Joi.object().keys({
                rows: Joi.number().valid(3).required(),
                columns : Joi.number().valid(5).required()
            }),
            payarray : Joi.array().items(Joi.array().items(Joi.number())).required(),
            payTable : Joi.object().keys({
                H1: payObject,
                H2: payObject,
                H3: payObject,
                A: payObject,
                K: payObject,
                J: payObject,
                SCATTER: payObject
            }),
            arrayOfReel : Joi.array().items(Joi.array().items(Joi.string())).required(),
            maxWinAmount : Joi.number(),
            docType : Joi.string().valid('game')
        })
        const result = gameConfigSchema.validate(req.body);
        if(result.error){
            console.log(result.error);
            return falshMessage.resDispatchError(res, 'GAME_VARIABLE_ERROR');
        }else{
            return next();
        }
    }
}
const validation = new GameValidator();
module.exports.gameValidator=validation;