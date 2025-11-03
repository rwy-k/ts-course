import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { Status, Priority, type ITask, type ITaskUpdate } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getTasks(req: Request, res: Response) {
        const { status, priority, createdAt } = req.query;
        res.status(200).json(this.taskService.getTasks({ status: status as Status, priority: priority as Priority, createdAt: createdAt as string }));
    }

    getTaskById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        res.status(200).json(this.taskService.getTaskById(id));
    }

    createTask(req: Request, res: Response) {
        const task = req.body as ITask;
        res.status(201).json(this.taskService.createTask(task));
    }

    deleteTask(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        res.status(200).json(this.taskService.deleteTask(id));
    }

    updateTask(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const task = req.body as ITaskUpdate;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        res.status(200).json(this.taskService.updateTask(id, task));
    }
}
