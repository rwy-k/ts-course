import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { TaskService } from '../services/task.service.js';
import { queryParamsValidatorGetAll, queryParamsValidatorGetById } from '../middleware/queryParams.js';
import { requestBodyValidator } from '../middleware/requestBody.js';

const router = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.get('/', queryParamsValidatorGetAll, taskController.getTasks);

router.get('/:id', queryParamsValidatorGetById, taskController.getTaskById);

router.post('/', requestBodyValidator, taskController.createTask);

router.delete('/:id', taskController.deleteTask);

router.put('/:id', requestBodyValidator, taskController.updateTask);

export default router;