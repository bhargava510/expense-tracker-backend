import { Router } from 'express';
import * as ctrl from '../controllers/expense.controller.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.get('/', h(ctrl.list));
router.get('/:id', h(ctrl.getOne));
router.post('/', h(ctrl.create));
router.put('/:id', h(ctrl.update));
router.delete('/:id', h(ctrl.remove));
export default router;
