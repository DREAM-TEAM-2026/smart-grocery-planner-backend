import { Router } from 'express';
import { generateMealPlan } from '../controllers/generate-meal-plan.js';
import authenticate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  applyCalendarSchema,
  getMealPlanPayloadSchema,
  headerTimezoneSchema,
  mealPlanIdParamSchema,
  recommendPayloadSchema,
  updateMealPlanSchema,
} from '../validators/schema.js';
import { applyMealPlan } from '../controllers/apply-meal-plan.js';
import { getMealPlan } from '../controllers/get-meal-plan.js';
import { getMealDetailsById } from '../controllers/get-meal-details-by-id.js';
import { updateMealPlan } from '../controllers/update-meal-plan.js';
import { recommendMealPlan } from '../controllers/recommend-meal-plan.js';
import { deleteFutureMealPlan } from '../controllers/delete-future-meal-plan.js';
import { deleteMealPlanById } from '../controllers/delete-meal-plan-by-id.js';
import validateHeaders from '../../../middlewares/validateHeaders.js';
import validateQuery from '../../../middlewares/validateQuery.js';
import validateParams from '../../../middlewares/validateParams.js';

const router = Router();

router.get(
  '/calendar',
  authenticate,
  validateQuery(getMealPlanPayloadSchema),
  getMealPlan,
);
router.get(
  '/calendar/:id',
  authenticate,
  validateParams(mealPlanIdParamSchema),
  getMealDetailsById,
);
router.post(
  '/calendar',
  authenticate,
  validateHeaders(headerTimezoneSchema),
  validate(applyCalendarSchema),
  applyMealPlan,
);
router.patch(
  '/calendar',
  authenticate,
  validate(updateMealPlanSchema),
  updateMealPlan,
);
router.delete(
  '/calendar/future',
  authenticate,
  validateHeaders(headerTimezoneSchema),
  deleteFutureMealPlan,
);
router.delete(
  '/calendar/:id',
  authenticate,
  validate(mealPlanIdParamSchema),
  deleteMealPlanById,
);
router.get(
  '/calendar/generate',
  authenticate,
  validateHeaders(headerTimezoneSchema),
  generateMealPlan,
);
router.get(
  '/calendar/recommend',
  validate(recommendPayloadSchema),
  recommendMealPlan,
);

export default router;
