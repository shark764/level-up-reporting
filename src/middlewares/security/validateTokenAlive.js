import { getRefreshTokenValue } from '../../redis';
import { error } from '../../utils/response';

export const validateTokenAlive = (req, res, next) => {
  const { accessToken, user_id } = req;
  const key = `{${user_id}}{SESSION}{${accessToken}}`;

  getRefreshTokenValue(key, (err, value) => {
    if (err) {
      return res
        .status(500)
        .json(error({ requestId: req.id, code: 500, message: err.message }));
    }
    if (!value) {
      return res.status(404).json(error({ requestId: req.id, code: 404 }));
    }
    req.authToken = value;
    req.key = key;
    req.user_id = user_id;
    next();
  });
};
