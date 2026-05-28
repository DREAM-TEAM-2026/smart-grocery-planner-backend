import Joi from 'joi';

export const generateCartSchema = Joi.object({
  days: Joi.number().integer().positive().required(),
});
