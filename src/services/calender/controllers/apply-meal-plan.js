import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { InvariantError } from '../../../errors/index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const applyMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;
  const data = req.validated;
  const userTimezone = req.validHead['x-timezone'] || 'UTC';

  const todayStr = dayjs()
    .tz(userTimezone)
    .format('YYYY-MM-DD');

  const hasPastOrTodayDate = data.some((meal) => {
    const mealDateStr = dayjs(meal.scheduled_date).format('YYYY-MM-DD');
    return mealDateStr < todayStr;
  });

  if (hasPastOrTodayDate) {
    return next(
      new InvariantError(
        'Jadwal makan hanya dapat diterapkan untuk waktu Hari ini dan seterusnya.',
      ),
    );
  }

  if (
    (await calenderRepositories.countUpcomingMeals({ userId, todayStr })) > 0
  ) {
    return next(
      new InvariantError(
        'Harap hapus jadwal hari ini dan esok hari terlebih dahulu sebelum menyimpan jadwal baru.',
      ),
    );
  }

  const mealPlan = await calenderRepositories.saveMealPlan({ userId, data });

  if (!mealPlan) {
    return next(new InvariantError('Meal plan gagal disimpan'));
  }

  return response(res, 201, 'Meal Plan berhasil diterapkan');
};
