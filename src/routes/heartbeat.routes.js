import { Router } from 'express';
import { heartbeat } from '../controllers/heartbeat.controller';
import { authorization } from '../controllers/general.controller';
import { validator } from '../validation/heartbeat';
import {
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
} from '../middlewares/security';

// Express route
const router = Router();

// Sends a heartbeat to cloud game server about itself and all connected devices.
router.post(
  '/heartbeat',
  authorization,
  [validateExistenceAccessHeader, validateSession, validateTokenAlive],
  validator,
  heartbeat
);

export default router;
