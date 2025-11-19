import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { Status, Priority, type ITask, type ITaskUpdate, type ITaskFilter } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getTasks = async (req: Request<{}, {}, {}, ITaskFilter>, res: Response, next: NextFunction) => {
        const { status, priority, createdAt } = req.query;
        try {
            const tasks = await this.taskService.getTasks({ status: status, priority: priority, createdAt: createdAt });
            res.status(200).json(tasks);
        } catch (error) {
            next(error)
        }
    }

    getTaskById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const task = await this.taskService.getTaskById(id);
            res.status(200).json(task);
        } catch (error) {
            next(error)
        }
    }

    createTask = async (req: Request<{}, {}, ITask>, res: Response, next: NextFunction) => {
        const task = req.body; 
        try {
            const newTask = await this.taskService.createTask(task);
            res.status(201).json(newTask);
        } catch (error) {
            next(error)
        }
    }

    deleteTask = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            await this.taskService.deleteTask(id);
            res.status(204).send();
        } catch (error) {
            next(error)
        }
    }

    updateTask = async (req: Request<{ id: string }, {}, ITaskUpdate>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const task = req.body;
        try {
            const updatedTask = await this.taskService.updateTask(id, task);
            res.status(200).json(updatedTask);
        } catch (error) {
            next(error)
        }
    }
}
