import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserService } from '../services/user.service.js';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get('/', userController.getUsers);

router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

export default router;