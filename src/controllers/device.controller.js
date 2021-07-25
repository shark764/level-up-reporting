import faker from 'faker';
import { success } from '../utils/response';

export function postCommand(req, res, next) {
  res.status(200).json({
    requestId: req.id,
    code: 200,
    message: 'Post command received successfully',
    data: req.body,
  });
  next();
}
