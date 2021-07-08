import { success } from '../utils/response';

export function heartbeat(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: { message: 'Heartbeat default response' },
    })
  );
}
