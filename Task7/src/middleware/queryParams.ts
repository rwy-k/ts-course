import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Status, Priority, ITaskFilter } from '../types/task.types.js';
import { CustomError } from '../utils/customErrors.js';

const queryParamsFiltersSchema = z.object({
    status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]).optional(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
    createdAt: z.string().transform((str: string) => new Date(str)).optional(),
});

const queryParamsIdSchema = z.object({
    id: z.uuid({ version: 'v4', message: 'Invalid UUID' }),
});

export const queryParamsValidatorGetAll = (req: Request<{}, {}, {}, ITaskFilter>, res: Response, next: NextFunction) => {
    try {
        queryParamsFiltersSchema.parse(req.query);

        if (req.query.createdAt) {
            const date = new Date(req.query.createdAt);
            if (isNaN(date.getTime())) {
                return next(new CustomError('Invalid createdAt date', 400));
            }
        }
    } catch (error) {
        return next(new CustomError('Invalid query parameters', 400));
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