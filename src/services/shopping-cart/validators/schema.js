import Joi from 'joi';

export const generateCartSchema = Joi.object({
  days: Joi.number().valid(1, 7).required().messages({
    'any.only': 'Jumlah hari (days) hanya boleh bernilai 1 atau 7',
  }),
});
