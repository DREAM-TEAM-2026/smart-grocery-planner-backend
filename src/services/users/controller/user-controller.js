import UserRepositories from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import NotFoundError from '../../../errors/not-found-error.js';

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil ditampilkan', user);
};
