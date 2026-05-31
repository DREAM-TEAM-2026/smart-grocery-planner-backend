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

  const stateData = {
    id: uuidv7(),
    userId,
    startDate: tomorrowStr,
    endDate: targetDayStr,
  };

  const shoppingCart = await shoppingCartRepositories.generateNewCart({
    userId,
    valuesStr,
    queryParams,
    stateData,
  });

  if (!shoppingCart || shoppingCart === 0) {
    return next(new InvariantError('Shopping cart gagal disimpan'));
  }

  return response(res, 201, 'Shopping cart berhasil dibuat');
};

export const getShoppingCart = async (req, res, next) => {
  const { id: userId } = req.user;
  const userTimezone = req.validHead['x-timezone'];

  const cartItems = await shoppingCartRepositories.getShoppingCart(userId);

  if (!cartItems || cartItems.length === 0) {
    return next(new NotFoundError('Shopping Cart tidak ditemukan'));
  }

  let isStale = false;
  let isExpired = false;
  const cartState = await shoppingCartRepositories.getCartState(userId);

  if (cartState) {
    const { start_date, end_date, generated_at } = cartState;

    const modifiedRecord =
      await shoppingCartRepositories.getCalendarLastModified({
        userId,
        startDate: start_date,
        endDate: end_date,
      });

    const calendarLastModified = modifiedRecord?.calendar_last_modified;

    if (calendarLastModified !== null && calendarLastModified !== undefined) {
      const dtLastModified = calendarLastModified.getTime();
      const dtGeneratedAt = generated_at.getTime();

      isStale = dtLastModified > dtGeneratedAt;
    }

    const today = dayjs().tz(userTimezone).startOf('day');
    const cartEndDate = dayjs(end_date).tz(userTimezone).startOf('day');

    isExpired = today.isAfter(cartEndDate);
  }

  return response(res, 200, 'Shopping cart berhasil ditampilkan', {
    is_stale: isStale,
    is_expired: isExpired,
    items: cartItems,
  });
};

export const toggleShoppingCart = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: itemId } = req.validated;

  const toggle = await shoppingCartRepositories.toggleCart({ userId, itemId });

  if (!toggle) {
    return next(new InvariantError('Id Bahan tidak ditemukan'));
  }

  return response(res, 200, 'Toggle berhasil', toggle);
};
