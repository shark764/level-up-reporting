import { Router } from 'express';
import { heartbeat, register } from '../controllers/game-controller.controller';
import { authorization } from '../controllers/general.controller';
import { validator } from '../validation/game-controller';
import {
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
} from '../middlewares/security';

/**
 * Game Controller Communication
 */

// Express route
const router = Router();

// Registers the Game Controller to the mothership
// each time the hardware starts up.
router.post(
  '/register',
  authorization,
  [validateExistenceAccessHeader, validateSession, validateTokenAlive],
  validator,
  register
);
// Sends a heartbeat to cloud game server
// about itself and all connected devices.
router.post(
  '/heartbeat',
  authorization,
  [validateExistenceAccessHeader, validateSession, validateTokenAlive],
  validator,
  heartbeat
);

export default router;
