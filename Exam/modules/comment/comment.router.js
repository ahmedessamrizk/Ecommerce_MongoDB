import { Router } from 'express'
import * as commentController from './controller/comment.js'
import { auth } from './../../middleware/auth.js';
import { validation } from './../../middleware/validation.js';
import * as commentValidators from './comment.validation.js'

const router = Router();

router.post('/addComment',validation(commentValidators.addComment), auth(), commentController.addComment)
router.patch('/updateComment/:id', validation(commentValidators.updateComment), auth(), commentController.updateComment)
router.patch('/deleteComment/:id',validation(commentValidators.softDeleteComment), auth(), commentController.softDeleteComment)

export default router;