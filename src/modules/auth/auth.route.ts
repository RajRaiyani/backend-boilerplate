import { Router } from 'express';
import withDatabase from '@/core/withDatabase.js';
import validate from '@/middleware/requestValidator.js';

import { Controller as registerUser, ValidationSchema as registerUserValidationSchema } from '@/modules/auth/controllers/registerUser.js';
import { Controller as verifyRegistration, ValidationSchema as verifyRegistrationValidationSchema } from '@/modules/auth/controllers/verifyRegistration.js';
import { Controller as loginUser, ValidationSchema as loginUserValidationSchema } from '@/modules/auth/controllers/loginUser.js';

const router = Router();

router.route('/register')
  .post(validate(registerUserValidationSchema), withDatabase(registerUser));

router.route('/verify-registration')
  .post(validate(verifyRegistrationValidationSchema), withDatabase(verifyRegistration));

router.route('/login')
  .post(validate(loginUserValidationSchema), withDatabase(loginUser));

export default router;
