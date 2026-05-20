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

    const token = authHeader.split(' ')[1];
    const authData = await TokenManager.verifyNeonToken(token);

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
