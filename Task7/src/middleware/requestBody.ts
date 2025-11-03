import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { Status, Priority, TaskType } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

const taskSchema = z.object({
    deadline: z.string().transform((str: string) => new Date(str)),
    description: z.string().optional(),
    status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
    type: z.enum([TaskType.TASK, TaskType.STORY, TaskType.EPIC, TaskType.BUG, TaskType.FEATURE]),
    title: z.string(),
});

export const requestBodyValidator = (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST' && req.method !== 'PUT') return next();
    
    try {
        taskSchema.parse(req.body);
        next();
    } catch (error) {
        return next(new CustomError((error as ZodError).message, 400));
    }
};