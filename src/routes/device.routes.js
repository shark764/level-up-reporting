import { Router } from 'express';
import { postCommand } from '../controllers/device.controller';
import {
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
} from '../middlewares/security';
import { postCommandWSEvent } from '../middlewares/socket.io/device';

// Express route
const router = Router();

const middleware = [
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
];

// Set/reset all device states to prep for the next game.
router.post('/device-commands', middleware, postCommand, [postCommandWSEvent]);

export default router;
