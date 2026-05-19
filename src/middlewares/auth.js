import TokenManager from '../security/token-manager.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Kredensial tidak disediakan atau format salah',
      });
    }

    // Ambil string tokennya saja
    const token = authHeader.split(' ')[1];

    // Validasi token via TokenManager
    const authData = await TokenManager.verifyNeonToken(token);

    // Simpan objek user ke request Express agar bisa dipakai di controller
    // (Misal: req.user.id untuk dipakai sebagai `user_id` di Notes)
    req.user = authData.user;

    next();
  } catch {
    return res.status(401).json({
      status: 'fail',
      message: 'Akses ditolak: Token tidak valid',
    });
  }
};

export default authenticate;
