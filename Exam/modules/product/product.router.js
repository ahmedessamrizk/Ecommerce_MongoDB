import { Router } from 'express'
import * as productController from './controller/product.js'
import { auth } from './../../middleware/auth.js';
import { validation } from './../../middleware/validation.js';
import * as productValidators from './product.validation.js'
import { checkProfile } from './../../services/profile.js';

const router = Router();

router.post('/addProduct',validation(productValidators.addProduct) ,auth(), checkProfile(), productController.addProduct);
router.put('/updateProduct/:id',validation(productValidators.updateProduct), auth(), productController.updateProduct);
router.delete('/removeProduct/:id',validation(productValidators.deleteProduct), auth(), productController.deleteProduct);
router.patch('/deleteProduct/:id',validation(productValidators.softDeleteProduct), auth(), productController.softDeleteProduct);
router.get('/title',validation(productValidators.getProductsByTitle), productController.getProductByTitle)
router.get('/:id',validation(productValidators.getProductsByID), productController.getProductByID)
router.patch('/like/:id',validation(productValidators.likeProduct), auth(), productController.likeProduct)
router.patch('/unlike/:id', validation(productValidators.unLikeProduct), auth(), productController.unLikeProduct)
router.get('/', productController.getProducts)

export default router;