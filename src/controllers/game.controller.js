import faker from 'faker';
import { success } from '../utils/response';

export function serverStatus(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: {
        status: 'ON',
        active: true,
      },
    })
  );
}

export function serverLog(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: {
        log: [{ message: 'Test log', timestamp: new Date() }],
      },
    })
  );
}

export function devices(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: {
        devices: [
          {
            id: faker.datatype.uuid(),
            softwareOs: faker.database.engine(),
            timestamp: new Date(),
          },
        ],
      },
    })
  );
}

export function setState(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: {
        state: req.body.state,
        timestamp: new Date(),
      },
    })
  );
}

export function startGame(req, res, next) {
  res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: {
        context: req.body,
        timestamp: new Date(),
      },
    })
  );
  next();
}

export function endGame(req, res) {
  return res.status(200).json(
    success({
      requestId: req.id,
      code: 200,
      data: {
        gameId: req.params.id,
        timestamp: new Date(),
      },
    })
  );
}
