import { Router } from 'express';
import { generateMealPlan } from '../controllers/generate-meal-plan.js';
import authenticate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { applyCalendarSchema } from '../validators/schema.js';
import { applyMealPlan } from '../controllers/apply-meal-plan.js';

const router = Router();

router.get('/calendar/generate', authenticate, generateMealPlan);
router.post(
  '/calendar',
  authenticate,
  validate(applyCalendarSchema),
  applyMealPlan,
);

export default router;
