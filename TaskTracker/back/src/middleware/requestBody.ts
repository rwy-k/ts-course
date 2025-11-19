import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { Status, Priority, TaskType } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

const taskSchema = z.object({
    deadline: z.string().transform((str: string) => new Date(str)),
    description: z.string().optional(),
    status: z.enum(Object.values(Status)),
    priority: z.enum(Object.values(Priority)),
    type: z.enum(Object.values(TaskType)),
    title: z.string(),
});

const taskUpdateSchema = z.object({
    deadline: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(Object.values(Status)).optional(),
    priority: z.enum(Object.values(Priority)).optional(),
    type: z.enum(Object.values(TaskType)).optional(),
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
