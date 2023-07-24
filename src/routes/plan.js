import express from 'express';
import { createPlan } from '../controllers/plan.js';
import { isSignedIn } from '../middlewares/index.js';

const router = express.Router();

router.post('/', isSignedIn, createPlan);

export default router;
