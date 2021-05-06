import { Router } from 'express';
import { heartbeat } from '../controllers/heartbeat.controller';
import { authorization, timeLog } from '../controllers/general.controller';

// Express route
const router = Router();

// Apply timeLog middleware
router.use(timeLog);

// HeartBeat received
router.post('/', authorization, heartbeat);

export default router;
