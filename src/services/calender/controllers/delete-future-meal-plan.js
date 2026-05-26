import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { NotFoundError } from '../../../errors/index.js';

export const deleteFutureMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;

  const deletedMealPlan = await calenderRepositories.deleteUpcomingMeal(userId);

  if (!deletedMealPlan) {
    return next(new NotFoundError('Meal Plan Tidak ditemukan'));
  }

  return response(res, 200, `${deletedMealPlan} Jadwal berhasil dihapus`);
};
