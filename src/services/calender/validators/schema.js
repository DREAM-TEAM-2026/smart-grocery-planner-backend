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
