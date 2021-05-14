import { Router } from 'express';
import { heartbeat } from '../controllers/heartbeat.controller';
import { authorization, timeLog } from '../controllers/general.controller';
import { validator } from '../validation/heartbeat';

// Express route
const router = Router();

// Apply timeLog middleware
router.use(timeLog);

// HeartBeat received
router.post('/', authorization, validator, heartbeat);

export default router;
