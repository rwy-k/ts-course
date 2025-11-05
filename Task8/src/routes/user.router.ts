import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserService } from '../services/user.service.js';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get('/', userController.getUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;