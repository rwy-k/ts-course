import { taskSchema } from '@/shared/helpers/validation';
import { z } from 'zod';
import { Status, Priority, TaskType } from './enums';
import type { ReactNode } from 'react';

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

// props
export interface TaskCardProps {
    task: Task;
    viewTask: (id: string) => void;
}

export interface TaskDetailsProps {
    task: Task;
    deleteTask: (id: string) => void;
    updateTask: (id: string) => void;
}

export interface TaskFormProps {
    register: (name: keyof TaskFormData, options?: object) => object;
    errors: Partial<Record<keyof TaskFormData, { message?: string }>>;
    buttonText: string;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isDisabled: boolean;
    users: User[];
}

export interface DroppableColumnProps {
    status: Status;
    title: string;
    children: ReactNode;
}
