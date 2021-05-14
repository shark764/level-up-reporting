import { check, validationResult } from 'express-validator';
import { log } from '../utils';
import { error } from '../utils/response';

export const validator = [
  check('deviceId', 'Device ID is required')
    .not()
    .isEmpty(),
  check('deviceType', 'Device type is required')
    .not()
    .isEmpty(),
  check('deviceType')
    .isLength({ min: 3 })
    .withMessage('Device type must be at least 3 chars long'),
  check('osVersion', 'OS version is required')
    .not()
    .isEmpty(),
  check('osVersion')
    .isLength({ min: 3 })
    .withMessage('OS version must be at least 3 chars long'),
  check('softwareVersion', 'Software version is required')
    .not()
    .isEmpty(),
  check('softwareVersion')
    .isLength({ min: 3 })
    .withMessage('Software version must be at least 3 chars long'),
  check('devices', 'Devices list is required').exists(),
  check('devices', 'Devices list is empty').custom(
    (value, { req }) => Array.isArray(value) && value.length
  ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log('error', 'Errors were encountered in request body');
      return res
        .status(422)
        .json(error({ requestId: req.id, code: 422, errors: errors.array() }));
    }
    next();
  },
];
