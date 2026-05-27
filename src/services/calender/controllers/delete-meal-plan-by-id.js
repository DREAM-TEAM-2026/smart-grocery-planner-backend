/* eslint-disable camelcase */

import response from '../../../utils/response.js';
import calenderRepositories from '../repositories/calender-repositories.js';
import { NotFoundError } from '../../../errors/index.js';

export const deleteMealPlanById = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: scheduleId } = req.validated;

  const deletedId = await calenderRepositories.deleteMealPlanById(
    scheduleId,
    userId,
  );

  if (!deletedId) {
    return next(
      new NotFoundError(
        'Jadwal tidak ditemukan atau Anda tidak memiliki akses untuk menghapusnya.',
      ),
    );
  }

  return response(res, 200, 'Jadwal berhasil dibuang', {
    deleted_id: deletedId,
  });
};
