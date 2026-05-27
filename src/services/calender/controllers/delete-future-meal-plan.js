import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { NotFoundError } from '../../../errors/index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const deleteFutureMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;
  const userTimezone = req.validHead['x-timezone'];
  // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const tomorrowStr = dayjs()
    .tz(userTimezone)
    .add(1, 'day')
    .format('YYYY-MM-DD');

  const deletedMealPlan = await calenderRepositories.deleteUpcomingMeal({
    userId,
    tomorrowStr,
  });

  if (!deletedMealPlan) {
    return next(new NotFoundError('Meal Plan Tidak ditemukan'));
  }

  return response(res, 200, `${deletedMealPlan} Jadwal berhasil dihapus`);
};
