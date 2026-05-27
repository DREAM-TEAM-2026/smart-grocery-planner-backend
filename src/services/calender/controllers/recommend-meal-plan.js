/* eslint-disable camelcase */

import 'dotenv/config';
import response from '../../../utils/response.js';
import { InvariantError } from '../../../errors/index.js';

export const recommendMealPlan = async (req, res, next) => {
  const aiApi = `${process.env.AI_SERVICE_URL}/recommend`;

  const aiResponse = await fetch(aiApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.validated),
  });

  if (!aiResponse.ok) {
    return next(new InvariantError(`Response status: ${aiResponse.status}`));
  }

  const results = await aiResponse.json();

  const { recommendations } = results;

  const extractedRecipes = recommendations.map((item) => ({
    recipe_name: item.recipe_name,
    minutes: item.minutes,
    calories: item.calories,
    ingredients: item.ingredients,
    cooking_steps: item.cooking_steps,
  }));

  return response(res, 200, 'Berhasil ditampilkan', {
    recipes: extractedRecipes,
  });
};
