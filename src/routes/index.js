import { Router } from 'express';
import notes from '../services/notes/routes/index.js';
import users from '../services/users/routes/index.js';

const router = Router();

router.use('/', users);
router.use('/', notes);

export default router;
