import 'dotenv/config';
import path from 'path';
import { Router } from 'express';
import { authorization } from '../controllers/general.controller';

// Express route
const router = Router();

/**
 * Define the first route
 */
router.get('/hello', authorization, (req, res) => {
  res.send('<h1>Hello World!</h1>');
});
/**
 * Simple GET route
 */
router.get('/greeting', authorization, (req, res) => {
  res.json({ message: 'Hola mundo!' });
});
/**
 * Test Socket IO
 */
router.get('/ioclient', authorization, (req, res) => {
  res.sendFile(path.join(process.cwd() + '/public/testioclient.html'));
});

export default router;
