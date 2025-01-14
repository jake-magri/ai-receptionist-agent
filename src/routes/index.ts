import { Router } from 'express';
import { handleCall } from '../controllers/aiController.js';

const router = Router();

router.post('/handle-call', handleCall);

export default router;
