import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.get('/periods', ctrl.listPeriods);
router.get('/', h(ctrl.getOne));
export default router;
