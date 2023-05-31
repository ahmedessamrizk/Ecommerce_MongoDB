import { Router } from 'express'
import * as userController from './controller/user.js';
import * as userValidators from './user.validation.js'
import { auth } from './../../middleware/auth.js';
import { validation } from './../../middleware/validation.js';

const router = Router();

router.patch('/profile', validation(userValidators.updateProfile),auth(),  userController.updateProfile);
router.patch('/password', validation(userValidators.updatePassword),auth(),  userController.updatePassword);
router.patch('/delete', validation(userValidators.softDeleteProfile),auth(),  userController.softDeleteProfile);
router.get('/logout',validation(userValidators.SignOut), auth(), userController.SignOut)
router.get('/:id', validation(userValidators.getUserByID), userController.getUserByID);
router.get('/', userController.getUsers);
router.patch('/block',validation(userValidators.blockUser),auth(), userController.blockUser);

export default router;