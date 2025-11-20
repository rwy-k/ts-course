import { z } from 'zod';
import { Status, Priority, TaskType } from '@/features/tasks/enums';

export const taskSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    deadline: z.string().refine((date) => validateDeadline(date), {
        message: 'Deadline must be in the future',
    }),
    status: z.enum(Object.values(Status)),
    priority: z.enum(Object.values(Priority)),
    type: z.enum(Object.values(TaskType)),
    userId: z.string(),
});

export const validateDeadline = (deadline: Date | string): boolean => {
    if (typeof deadline === 'string') {
        deadline = new Date(deadline);
    }
    return deadline > new Date();
};
