import { Router } from 'express';
import { generateMealPlan } from '../controllers/calender-controller.js';

const router = Router();

router.get('/calendar/generate', generateMealPlan);

export default router;
