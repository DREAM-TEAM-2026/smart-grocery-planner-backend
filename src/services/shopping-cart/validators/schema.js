import Joi from 'joi';

export const generateCartSchema = Joi.object({
  days: Joi.number().integer().min(1).max(7).required().messages({
    'number.min': 'Days must be at least 1',
    'number.max': 'Days cannot exceed 7',
  }),
});

export const shoppingCartIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
