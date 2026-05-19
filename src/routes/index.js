import { Router } from 'express';
import notes from '../services/notes/routes/index.js';
import users from '../services/users/routes/index.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.use('/', users);
router.use(authenticate);
router.use('/', notes);

export default router;
