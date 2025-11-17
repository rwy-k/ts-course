import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { Status, Priority, TaskType } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

const taskSchema = z.object({
    deadline: z.string().transform((str: string) => new Date(str)).refine((date) => date > new Date(), { message: 'Deadline must be in the future' }),
    description: z.string().optional(),
    status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
    type: z.enum([TaskType.TASK, TaskType.STORY, TaskType.EPIC, TaskType.BUG, TaskType.FEATURE]),
    title: z.string(),
});

const taskUpdateSchema = z.object({
    deadline: z.string().transform((str: string) => new Date(str)).optional(),
    description: z.string().optional(),
    status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]).optional(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
    type: z.enum([TaskType.TASK, TaskType.STORY, TaskType.EPIC, TaskType.BUG, TaskType.FEATURE]).optional(),
    title: z.string().optional(),
});

export const requestBodyValidator = (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST' && req.method !== 'PUT') return next();
    
    try {
        if (req.method === 'POST') {
            taskSchema.parse(req.body);
        } else {
            taskUpdateSchema.parse(req.body);
        }
        next();
    } catch (error) {
        return next(new CustomError((error as ZodError).message, 400));
    }
};