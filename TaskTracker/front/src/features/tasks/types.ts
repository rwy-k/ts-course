import { taskSchema } from '@/shared/helpers/validation';
import { z } from 'zod';
import { Status, Priority, TaskType } from './enums';

export interface Task {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    deadline: Date;
    status: Status;
    priority: Priority;
    type: TaskType;
    userId: string;
}

export interface User {
    id: string;
    name: string;
}

export { Status, Priority };

export type TaskFormData = z.input<typeof taskSchema>;
