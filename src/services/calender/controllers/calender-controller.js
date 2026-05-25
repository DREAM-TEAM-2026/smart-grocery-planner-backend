/* eslint-disable camelcase */

import 'dotenv/config';
import response from '../../../utils/response.js';

export const generateMealPlan = async (req, res, next) => {
  const aiApi = `${process.env.AI_SERVICE_URL}/meal-plan/generate`;

  try {
    const aiResponse = await fetch(aiApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!aiResponse.ok) {
      return next(new Error(`Response status: ${aiResponse.status}`));
    }

    const result = await aiResponse.json();

    const { days } = result;

    const extractedMealPlan = days.flatMap((day) => {
      const meals = [];

      if (day.breakfast) {
        meals.push({
          scheduled_date: day.menu_date,
          meal_type: day.breakfast.meal_type,
          recipe_name: day.breakfast.recipe_name,
          minutes: day.breakfast.minutes,
          calories: day.breakfast.calories,
          ingredients: day.breakfast.ingredients,
          cooking_steps: day.breakfast.cooking_steps,
        });
      }
      if (day.lunch) {
        meals.push({
          scheduled_date: day.menu_date,
          meal_type: day.lunch.meal_type,
          recipe_name: day.lunch.recipe_name,
          minutes: day.lunch.minutes,
          calories: day.lunch.calories,
          ingredients: day.lunch.ingredients,
          cooking_steps: day.lunch.cooking_steps,
        });
      }
      if (day.dinner) {
        meals.push({
          scheduled_date: day.menu_date,
          meal_type: day.dinner.meal_type,
          recipe_name: day.dinner.recipe_name,
          minutes: day.dinner.minutes,
          calories: day.dinner.calories,
          ingredients: day.dinner.ingredients,
          cooking_steps: day.dinner.cooking_steps,
        });
      }

      return meals;
    });

    // TEST CODE
    // const calories = [];
    // extractedMealPlan.forEach((i) => {
    //   calories.push(i.calories);
    // });
    // const totalCal = calories.reduce((acc, curr) => acc + curr, 0);
    // console.log(calories, totalCal);

    return response(res, 200, 'Berhasil ditampilkan', extractedMealPlan);
  } catch (error) {
    console.error(error.message);
  }
};
