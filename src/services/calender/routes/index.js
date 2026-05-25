import { Router } from 'express';
import { generateMealPlan } from '../controllers/generate-meal-plan.js';
import authenticate from '../../../middlewares/auth.js';

const router = Router();

router.get('/calendar/generate', authenticate, generateMealPlan);

export default router;
