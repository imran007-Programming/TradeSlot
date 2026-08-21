import { Router } from 'express';
import workController from './workArea.controller';
import authGuard from '../../middleware/auth.middleware';

const router = Router()

router.post('/set-area', authGuard, workController.setWorkArea)
router.get('/', authGuard, workController.getWorkAreas)
router.patch('/:id', authGuard, workController.updateWorkArea)
router.delete('/:id', authGuard, workController.deleteWorkArea)

export const workAreaRoute = router;