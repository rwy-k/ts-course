import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import type { ITaskFilter, ITask, ITaskUpdate } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getTasks = (req: Request<{}, {}, {}, ITaskFilter>, res: Response, next: NextFunction) => {
        const { status, priority, createdAt } = req.query;
        try {
            const tasks = this.taskService.getTasks({ 
                status: status, 
                priority: priority, 
                createdAt: createdAt 
            });
            res.status(200).json(tasks);
        } catch (error) {
            return next(new CustomError('Failed to get tasks', 500));
        }
    }

    getTaskById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        res.status(200).json(this.taskService.getTaskById(id));
    }

    createTask = async (req: Request<{}, {}, ITask>, res: Response, next: NextFunction) => {
        const task = req.body;
        res.status(201).json(this.taskService.createTask(task));
    }

    deleteTask = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        res.status(200).json(this.taskService.deleteTask(id));
    }

    updateTask = async (req: Request<{ id: string }, {}, ITaskUpdate>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const task = req.body;
        res.status(200).json(this.taskService.updateTask(id, task));
    }
}
