import Joi from 'joi';

const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailFormat).required().messages({
    'string.pattern.base': 'Please Enter valid email',
    'any.required': 'An `email` is required',
  }),
  password: Joi.string().pattern(passwordFormat).required().messages({
    'string.pattern.base': 'Please Enter valid password',
    'any.required': 'A `password` is required',
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailFormat).required().messages({
    'string.pattern.base': 'Please Enter valid email',
    'any.required': 'An `email` is required',
  }),
  password: Joi.string().pattern(passwordFormat).required().messages({
    'string.pattern.base': 'Please Enter valid password',
    'any.required': 'A `password` is required',
  }),
});
