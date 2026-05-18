import { Router } from 'express';
import { getUserById } from '../controller/user-controller.js';

const router = Router();

router.get('/users/:id', getUserById);

export default router;
