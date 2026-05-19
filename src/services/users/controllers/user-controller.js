import UserRepositories from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import NotFoundError from '../../../errors/not-found-error.js';

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil ditampilkan', user);
};

export const createUser = async (req, res, next) => {
  try {
    const { id } = req.body; // Cukup lempar id via body HTTP dari frontend

    if (!id) {
      return response(res, 400, 'ID user harus diberikan');
    }

    const newUser = await UserRepositories.addUser(id);

    return response(res, 201, 'User berhasil dibuat', newUser);
  } catch (error) {
    // Tangani jika misalnya ID tersebut sudah di-daftarkan sebelumnya (Duplikat PK)
    next(error);
  }
};
