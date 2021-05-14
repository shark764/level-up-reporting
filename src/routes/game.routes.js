import { Router } from 'express';
import { finishGame } from '../controllers/game.controller';
import { authorization, timeLog } from '../controllers/general.controller';

// Express route
const router = Router();

// Apply timeLog middleware
router.use(timeLog);

// Finish Game
router.delete('/:id', authorization, finishGame);

export default router;
