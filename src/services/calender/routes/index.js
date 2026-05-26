import { Router } from 'express';
import { generateMealPlan } from '../controllers/generate-meal-plan.js';
import authenticate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  applyCalendarSchema,
  getMealPlanPayloadSchema,
  updateMealPlanSchema,
} from '../validators/schema.js';
import { applyMealPlan } from '../controllers/apply-meal-plan.js';
import { getMealPlan } from '../controllers/get-meal-plan.js';
import { updateMealPlan } from '../controllers/update-meal-plan.js';
import { recommendMealPlan } from '../controllers/recommend-meal-plan.js';
import { deleteFutureMealPlan } from '../controllers/delete-future-meal-plan.js';

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
router.patch(
  '/calendar',
  authenticate,
  validate(updateMealPlanSchema),
  updateMealPlan,
);
router.delete('/calendar/future', authenticate, deleteFutureMealPlan);
router.get('/calendar/generate', authenticate, generateMealPlan);
router.get('/calendar/recommend', recommendMealPlan);

export default router;
