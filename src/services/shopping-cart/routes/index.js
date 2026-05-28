import { Router } from 'express';
import { generateShoppingCart } from '../controllers/shopping-cart-controllers.js';
import authenticate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { generateCartSchema } from '../validators/schema.js';
import validateHeaders from '../../../middlewares/validateHeaders.js';
import { headerTimezoneSchema } from '../../calender/validators/schema.js';

const router = Router();

router.post(
  '/shopping-cart/generate',
  authenticate,
  validateHeaders(headerTimezoneSchema),
  validate(generateCartSchema),
  generateShoppingCart,
);

export default router;
