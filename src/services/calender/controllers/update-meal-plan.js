import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { InvariantError } from '../../../errors/index.js';

export const updateMealPlan = async (req, res, next) => {
  const { id: userId } = req.user;
  const { swaps: data } = req.validated;

  const targetScheduleIds = data.map((s) => s.target_schedule_id);

  const isOwner = await calenderRepositories.verifyOwnership({
    userId,
    targetScheduleIds,
  });

  if (!isOwner) {
    return next(
      new InvariantError(
        'Akses ditolak: Sebagian jadwal tidak ditemukan atau bukan milik Anda.',
      ),
    );
  }

  await calenderRepositories.updateMealPlan({ userId, data });

  return response(res, 200, 'Berhasil memperbarui jadwal makan', null);
};
