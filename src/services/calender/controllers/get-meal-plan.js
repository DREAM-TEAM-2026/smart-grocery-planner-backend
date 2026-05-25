/* eslint-disable camelcase */

import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { NotFoundError } from '../../../errors/index.js';

export const getMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;
  const { start_date, end_date } = req.validated;

  const mealPlan = await calenderRepositories.getMealPlan({
    userId,
    start_date,
    end_date,
  });

  if (!mealPlan) {
    return next(new NotFoundError('Meal plan Tidak ditemukan'));
  }

  const groupedCalendar = mealPlan.reduce((accumulator, current) => {
    const dateObj = new Date(current.scheduled_date);

    const dateKey = dateObj.toISOString().split('T')[0];
    const mealType = current.meal_type;

    if (!accumulator[dateKey]) {
      accumulator[dateKey] = {};
    }

    accumulator[dateKey][mealType] = {
      id: current.id,
      recipe_name: current.recipe_name,
      minutes: current.minutes,
      calories: current.calories,
      ingredients: current.ingredients,
      cooking_steps: current.cooking_steps,
    };

    return accumulator;
  }, {});

  return response(res, 201, 'Mealplan Sukses Ditampilkan', groupedCalendar);
};
