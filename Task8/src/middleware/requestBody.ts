import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { Status, Priority, TaskType } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

const taskSchema = z.object({
    deadline: z.string().transform((str: string) => new Date(str)).refine((date) => date > new Date(), { message: 'Deadline must be in the future' }),
    description: z.string().optional(),
    status: z.enum(Object.values(Status)),
    priority: z.enum(Object.values(Priority)),
    type: z.enum(Object.values(TaskType)),
    title: z.string(),
    userId: z.string(),
});

const taskUpdateSchema = taskSchema.partial();

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
        if (error instanceof ZodError) {
            return next(new CustomError(error.message, 400));
        }
        return next(new CustomError('Failed to validate request body', 400));
    }
};