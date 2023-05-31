import { Router } from 'express'
import * as authController from './controller/auth.js';
import { validation } from './../../middleware/validation.js';
import * as authValidators from './auth.validation.js';

const router = Router();

router.post('/signup', validation(authValidators.SignUp), authController.SignUp)
router.get('/confirmEmail/:token', validation(authValidators.confirmEmail), authController.confirmEmail);
router.get('/refreshToken/:token', authController.refreshToken)
router.post('/signin', validation(authValidators.SignIn), authController.SignIn);
router.patch('/sendCode', validation(authValidators.sendCode), authController.sendCode)
router.patch('/forgetPassword', validation(authValidators.forgetPassword), authController.forgetPassword)

export default router;