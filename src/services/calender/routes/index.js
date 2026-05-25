import { Router } from 'express';
import { generateMealPlan } from '../controllers/generate-meal-plan.js';
import authenticate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  applyCalendarSchema,
  getMealPlanPayloadSchema,
} from '../validators/schema.js';
import { applyMealPlan } from '../controllers/apply-meal-plan.js';
import { getMealPlan } from '../controllers/get-meal-plan.js';

const router = Router();

router.get(
  '/calendar',
  authenticate,
  validate(getMealPlanPayloadSchema),
  getMealPlan,
);
router.post(
  '/calendar',
  authenticate,
  validate(applyCalendarSchema),
  applyMealPlan,
);
router.get('/calendar/generate', authenticate, generateMealPlan);

export default router;
