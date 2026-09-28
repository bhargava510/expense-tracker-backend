import { Router } from 'express';
import * as ctrl from '../controllers/category.controller.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.get('/', h(ctrl.list));
router.post('/', h(ctrl.create));
export default router;
