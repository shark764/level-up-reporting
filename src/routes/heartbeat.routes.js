import { Router } from 'express';
import { heartbeat } from '../controllers/heartbeat.controller';
import { authorization, timeLog } from '../controllers/general.controller';
import { validator } from '../validation/heartbeat';
import { validateExistenceAccessHeader } from '../middlewares/validateExistenceAccessHeader';
import { validateSession } from '../middlewares/validateSession';
import { validateTokenAlive } from '../middlewares/validateTokenAlive';

// Express route
const router = Router();

// Apply timeLog middleware
router.use(timeLog);

// HeartBeat received
router.post(
  '/',
  authorization,
  [validateExistenceAccessHeader, validateSession, validateTokenAlive],
  validator,
  heartbeat
);

export default router;
