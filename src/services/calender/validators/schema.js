/* eslint-disable camelcase */

import Joi from 'joi';

const mealSlotSchema = Joi.object({
  scheduled_date: Joi.date().iso().required(),
  meal_type: Joi.string().valid('breakfast', 'lunch', 'dinner').required(),
  recipe_name: Joi.string().required(),
  minutes: Joi.number().integer().min(0).required(),
  calories: Joi.number().integer().min(0).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  cooking_steps: Joi.array().items(Joi.string()).min(1).required(),
});

export const applyCalendarSchema = Joi.array()
  .items(mealSlotSchema)
  .length(21)
  .required();

export const getMealPlanPayloadSchema = Joi.object({
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required(),
});

// Tambahkan export baru di bawah
export const updateMealPlanSchema = Joi.object({
  swaps: Joi.array()
    .items(
      Joi.object({
        target_schedule_id: Joi.string().uuid().required(),
        recipe_name: Joi.string().required(),
        minutes: Joi.number().integer().min(0).required(),
        calories: Joi.number().integer().min(0).required(),
        ingredients: Joi.array().items(Joi.string()).min(1).required(),
        cooking_steps: Joi.array().items(Joi.string()).min(1).required(),
      }),
    )
    .unique('target_schedule_id') // <-- Menambahkan validasi unik beradasarkan field ini
    .messages({
      'array.unique':
        'target_schedule_id di dalam swaps tidak boleh ada yang duplikat',
    })
    .min(1)
    .required(),
});

export const mealPlanIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const recommendPayloadSchema = Joi.object({
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  min_calories: Joi.number().integer().min(0),
  max_calories: Joi.number().integer().min(Joi.ref('min_calories')).messages({
    'number.min': '"max_calories" tidak boleh lebih kecil dari "min_calories"',
  }),
});

const timezoneValidator = (value, helpers) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return value;
  } catch {
    return helpers.error('any.invalid');
  }
};

export const headerTimezoneSchema = Joi.object({
  'x-timezone': Joi.string()
    .trim()
    .default('UTC')
    .custom(timezoneValidator)
    .messages({
      'any.invalid':
        'Header x-timezone wajib dalam format IANA (cth: Asia/Jakarta)',
    }),
}).unknown(true);
