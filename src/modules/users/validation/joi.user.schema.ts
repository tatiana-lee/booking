import * as Joi from 'joi';

export const joiUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(1),
  role: Joi.string().optional().valid('admin', 'client', 'manager'),
});
