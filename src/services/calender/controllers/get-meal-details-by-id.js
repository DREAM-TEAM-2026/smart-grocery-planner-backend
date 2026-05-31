import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { NotFoundError } from '../../../errors/index.js';

export const getMealDetailsById = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: slotId } = req.validated;

  const meal = await calenderRepositories.getMealDetails({
    userId,
    slotId,
  });

  if (!meal) {
    return next(new NotFoundError('Meal Slot Not Found'));
  }

  return response(res, 200, 'Meal Details Successfully Shown', meal);
};
