import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const deleteTodayAndFutureMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;
  const userTimezone = req.validHead['x-timezone'];

  const todayStr = dayjs()
    .tz(userTimezone)
    .format('YYYY-MM-DD');

  const deletedMealPlan = await calenderRepositories.deleteUpcomingMeal({
    userId,
    todayStr,
  });

  if (!deletedMealPlan) {
    return response(res, 204, 'Tidak ada Jadwal untuk dihapus');
  }

  return response(res, 200, `${deletedMealPlan} Jadwal berhasil dihapus`);
};
