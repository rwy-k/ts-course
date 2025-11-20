import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { type ITask, type ITaskUpdate, type ITaskFilter } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getTasks = async (req: Request<object, object, object, ITaskFilter>, res: Response, next: NextFunction) => {
        const { status, priority, createdAt } = req.query;
        try {
            const tasks = await this.taskService.getTasks({
                status: status,
                priority: priority,
                createdAt: createdAt,
            });
            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                return next(error);
            }
            return next(new CustomError('Failed to get tasks', 400));
        }
    };

    getTaskById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const task = await this.taskService.getTaskById(id);
            res.status(200).json(task);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                return next(error);
            }
            return next(new CustomError('Failed to get task', 400));
        }
    };

    createTask = async (req: Request<object, object, ITask>, res: Response, next: NextFunction) => {
        const task = req.body;
        try {
            const newTask = await this.taskService.createTask(task);
            res.status(201).json(newTask);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                return next(error);
            }
            return next(new CustomError('Failed to create task', 400));
        }
    };

    deleteTask = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            await this.taskService.deleteTask(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof CustomError) {
                return next(error);
            }
            return next(new CustomError('Failed to delete task', 400));
        }
    };

    updateTask = async (req: Request<{ id: string }, object, ITaskUpdate>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const task = req.body;
        try {
            const updatedTask = await this.taskService.updateTask(id, task);
            res.status(200).json(updatedTask);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                return next(error);
            }
            return next(new CustomError('Failed to update task', 400));
        }
    };
}
