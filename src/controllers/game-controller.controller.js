import { success } from '../utils/response';

export function register(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: { message: 'Device was registered successfully' },
    })
  );
}

export function heartbeat(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: { message: 'Update of state of device was successfully received' },
    })
  );
}
