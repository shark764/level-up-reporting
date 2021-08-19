import { check, validationResult } from 'express-validator';
import { log } from '../utils';
import { error } from '../utils/response';

export const validator = [
  check('device_id', 'Device ID is required')
    .not()
    .isEmpty(),

  check('balena_name', 'Balena name is required')
    .not()
    .isEmpty(),
  check('balena_name')
    .isLength({ min: 3 })
    .withMessage('Balena name must be at least 3 chars long'),

  check('device_type', 'Device type is required')
    .not()
    .isEmpty(),
  check('device_type')
    .isLength({ min: 3 })
    .withMessage('Device type must be at least 3 chars long'),

  check('device_info', 'Device info is required')
    .not()
    .isEmpty(),
  check('device_info')
    .isLength({ min: 3 })
    .withMessage('Device info must be at least 3 chars long'),

  check('build_info', 'Build info is required')
    .not()
    .isEmpty(),
  check('build_info')
    .isLength({ min: 3 })
    .withMessage('Build info must be at least 3 chars long'),

  check('devices', 'Devices list is required').exists(),
  // check('devices', 'Devices list is empty').custom(
  //   (value) => Array.isArray(value) && value.length
  // ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log('error', 'Errors were encountered in request body');
      return res.status(400).json(
        error({
          requestId: req.id,
          code: 400,
          errors: errors.array(),
        })
      );
    }
    next();
  },
];
