import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { Status, Priority } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

const queryParamsFiltersSchema = z.object({
    status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]).optional(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
    createdAt: z.string().transform((str: string) => new Date(str)).optional(),
});

const queryParamsIdSchema = z.object({
    id: z.string().uuid({ version: 'v4', message: 'Invalid UUID' }),
});

export const queryParamsValidatorGetAll = (req: Request, res: Response, next: NextFunction) => {
    try {
        queryParamsFiltersSchema.parse(req.query);
    } catch (error) {
        if (error instanceof ZodError) {
            return next(new CustomError(error.message, 400));
        }
        return next(new CustomError('Failed to validate query parameters', 400));
    }
    next();
};

export const queryParamsValidatorGetById = (req: Request, res: Response, next: NextFunction) => {
    try {
        queryParamsIdSchema.parse(req.params);
    } catch (error) {
        return next(new CustomError('Invalid ID', 400));
    }
    next();
};