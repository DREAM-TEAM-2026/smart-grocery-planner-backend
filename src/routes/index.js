import { Router } from 'express';
import users from '../services/users/routes/index.js';
import calendar from '../services/calender/routes/index.js';
import shoppingCart from '../services/shopping-cart/routes/index.js';

const router = Router();

router.use('/', users);
router.use('/', calendar);
router.use('/', shoppingCart);

export default router;
