import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import InvariantError from '../../../errors/invariant-error.js';

export const applyMealPlan = async (req, res, next) => {
  const { id } = req.user;
  const data = req.validated;

  if ((await calenderRepositories.countUpcomingMeals(id)) > 0) {
    return next(
      new InvariantError(
        'Masih ada jadwal makan untuk esok hari. Harap hapus jadwal esok hari terlebih dahulu sebelum membuat jadwal baru.',
      ),
    );
  }

  const mealPlan = await calenderRepositories.saveMealPlan({ id, data });

  if (!mealPlan) {
    return next(new InvariantError('Error'));
  }

  return response(res, 201, 'Meal Plan berhasil diterapkan');
};
