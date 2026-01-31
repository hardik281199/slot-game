import Joi from 'joi';

const payObject = Joi.object()
  .keys({
    '3ofakind': Joi.number().required(),
    '4ofakind': Joi.number().required(),
    '5ofakind': Joi.number().required(),
  })
  .required();

export const addGameSchema = Joi.object({
  gameName: Joi.string().min(3).max(15).required(),
  viewZone: Joi.object()
    .keys({
      rows: Joi.number().min(3).max(6).required(),
      columns: Joi.number().min(3).max(6).required(),
    })
    .required(),
  payarray: Joi.array()
    .items(
      Joi.array()
        .items(Joi.number())
        .length(Joi.ref('...viewZone.columns', { render: true }))
    )
    .required(),
  payTable: Joi.object()
    .keys({
      H1: payObject,
      H2: payObject,
      H3: payObject,
      A: payObject,
      K: payObject,
      J: payObject,
      SCATTER: payObject,
    })
    .required(),
  arrayOfReel: Joi.array()
    .items(Joi.array().items(Joi.string()))
    .length(Joi.ref('viewZone.columns', { render: true }))
    .required(),
  maxWinAmount: Joi.number().positive().required(),
  docType: Joi.string().valid('game').optional(),
});

export const editGameSchema = addGameSchema;
