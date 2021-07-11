import { Router } from 'express';
import {
  devices,
  endGame,
  serverLog,
  serverStatus,
  setState,
  startGame,
} from '../controllers/game.controller';
import {
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
} from '../middlewares/security';
import {
  devicesContextUpdate,
  targetHit,
  targetUpdate,
} from '../middlewares/socket.io/game';

// Express route
const router = Router();

const middlewares = [
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
];

// Get the game server status.
router.get('/server', middlewares, serverStatus);
// Get the game server log.
router.get('/log', middlewares, serverLog);
// Get information on all registered devices.
router.get('/devices', middlewares, devices);
// Set/reset all device states to prep for the next game.
router.post('/state', middlewares, setState);
// Start a game session by sending a game context. See section 1.1.1.
// Server WebSocket asynchronously emits
// DEVICES_CONTEXT_UPDATE, TARGET_UPDATE, TARGET_HIT events.
router.post('/game', middlewares, startGame, [
  // devicesContextUpdate,
  // targetUpdate,
  // targetHit,
]);
// End a game session by cancelling it.
router.delete('/game/:id', middlewares, endGame);

export default router;
