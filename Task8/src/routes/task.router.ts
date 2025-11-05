import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { TaskService } from '../services/task.service.js';
import { queryParamsValidatorGetAll, queryParamsValidatorGetById } from '../middleware/queryParams.js';
import { requestBodyValidator } from '../middleware/requestBody.js';

const router = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.get('/', queryParamsValidatorGetAll, taskController.getTasks.bind(taskController));

router.get('/:id', queryParamsValidatorGetById, taskController.getTaskById.bind(taskController));

router.post('/', requestBodyValidator, taskController.createTask.bind(taskController));

router.delete('/:id', taskController.deleteTask.bind(taskController));

router.put('/:id', requestBodyValidator, taskController.updateTask.bind(taskController));

export default router;