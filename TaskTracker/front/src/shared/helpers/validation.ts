import { z } from 'zod';
import { Status, Priority, TaskType } from '@/features/tasks/enums';

export const taskSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    deadline: z.string().refine((date) => validateDeadline(date), {
        message: 'Deadline must be in the future',
    }),
    status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.IN_REVIEW, Status.DONE]),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
    type: z.enum([TaskType.TASK, TaskType.STORY, TaskType.EPIC, TaskType.BUG, TaskType.FEATURE]),
    userId: z.string(),
});

export const validateDeadline = (deadline: Date | string): boolean => {
    if (typeof deadline === 'string') {
        deadline = new Date(deadline);
    }
    return deadline > new Date();
};
