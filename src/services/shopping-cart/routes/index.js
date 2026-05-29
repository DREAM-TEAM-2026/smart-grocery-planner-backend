import { Router } from 'express';
import {
  generateShoppingCart,
  getShoppingCart,
  toggleShoppingCart,
} from '../controllers/shopping-cart-controllers.js';
import authenticate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import validateHeaders from '../../../middlewares/validateHeaders.js';
import validateParams from '../../../middlewares/validateParams.js';
import {
  generateCartSchema,
  shoppingCartIdParamSchema,
} from '../validators/schema.js';
import { headerTimezoneSchema } from '../../calender/validators/schema.js';

const router = Router();

router.get('/shopping-cart', authenticate, getShoppingCart);
router.post(
  '/shopping-cart/generate',
  authenticate,
  validateHeaders(headerTimezoneSchema),
  validate(generateCartSchema),
  generateShoppingCart,
);
router.patch(
  '/shopping-cart/:id/toggle',
  authenticate,
  validateParams(shoppingCartIdParamSchema),
  toggleShoppingCart,
);

export default router;
