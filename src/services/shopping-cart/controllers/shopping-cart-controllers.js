/* eslint-disable camelcase */

import dayjs from 'dayjs';
import response from '../../../utils/response.js';
import shoppingCartRepositories from '../repositories/shopping-cart-repositories.js';
import NotFoundError from '../../../errors/not-found-error.js';
import InvariantError from '../../../errors/invariant-error.js';
import { v7 as uuidv7 } from 'uuid';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const generateShoppingCart = async (req, res, next) => {
  const { id: userId } = req.user;
  const { days } = req.validated;
  const userTimezone = req.validHead['x-timezone'];

  await shoppingCartRepositories.deleteCurrentShoppingCart(userId);

  const tomorrowStr = dayjs()
    .tz(userTimezone)
    .add(1, 'day')
    .format('YYYY-MM-DD');

  const targetDayStr = dayjs()
    .tz(userTimezone)
    .add(days, 'days')
    .format('YYYY-MM-DD');

  const mealPlan = await shoppingCartRepositories.getFutureMealPlan({
    userId,
    tomorrowStr,
    targetDayStr,
  });

  if (!mealPlan || mealPlan.length === 0) {
    return next(
      new NotFoundError(
        'Meal Plan Tidak ditemukan, Buat Meal Plan sebelum membuat Shopping Cart',
      ),
    );
  }

  // 5. Transformasi & Agregasi Matematika (Lapisan Memori)
  const ingredientMap = new Map();

  mealPlan.forEach((meal) => {
    const { id, recipe_name, ingredients } = meal;

    ingredients.forEach((ingredientName) => {
      const normalizedName = ingredientName.toLowerCase().trim();

      if (!ingredientMap.has(normalizedName)) {
        ingredientMap.set(normalizedName, {
          ingredient_name: normalizedName,
          required_amount: 0,
          recipe_sources: [],
        });
      }

      const item = ingredientMap.get(normalizedName);
      item.required_amount += 1;

      item.recipe_sources.push({
        id,
        recipe_name,
      });
    });
  });

  const finalItems = Array.from(ingredientMap.values());

  // if (finalItems.length === 0) {
  //   return res.status(204).send();
  // }

  const values = [];
  const queryParams = [];
  let index = 1;

  finalItems.forEach((item) => {
    queryParams.push(
      uuidv7(),
      userId,
      item.ingredient_name,
      item.required_amount,
      JSON.stringify(item.recipe_sources),
    );
    values.push(
      `($${index++}, $${index++}, $${index++}, $${index++}, $${index++}::jsonb, false)`,
    );
  });

  const valuesStr = values.join(', ');

  const shoppingCart = await shoppingCartRepositories.addShoppingCart({
    valuesStr,
    queryParams,
  });

  if (!shoppingCart || shoppingCart === 0) {
    return next(new InvariantError('Meal plan gagal disimpan'));
  }

  return response(res, 201, 'Shopping cart berhasil dibuat');
};
