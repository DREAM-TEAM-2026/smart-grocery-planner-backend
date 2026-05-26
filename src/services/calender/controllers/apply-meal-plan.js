import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { InvariantError } from '../../../errors/index.js';

export const applyMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;
  const data = req.validated;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const hasPastOrTodayDate = data.some((meal) => {
    const mealDate = new Date(meal.scheduled_date);
    return mealDate < tomorrow;
  });

  if (hasPastOrTodayDate) {
    return next(
      new InvariantError(
        'Jadwal makan hanya dapat diterapkan untuk waktu esok hari dan seterusnya.',
      ),
    );
  }

  if ((await calenderRepositories.countUpcomingMeals(userId)) > 0) {
    return next(
      new InvariantError(
        'Masih ada jadwal makan untuk esok hari. Harap hapus jadwal esok hari terlebih dahulu sebelum membuat jadwal baru.',
      ),
    );
  }

  const mealPlan = await calenderRepositories.saveMealPlan({ userId, data });

  if (!mealPlan) {
    return next(new InvariantError('Meal plan gagal disimpan'));
  }

  return response(res, 201, 'Meal Plan berhasil diterapkan');
};
