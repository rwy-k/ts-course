import { taskSchema } from '@/shared/helpers/validation';
import { z } from 'zod';

export type Task = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    deadline: Date;
    status: Status;
    priority: Priority;
};
export enum Status {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}
export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

type FormErrors = Partial<Record<keyof TaskFormData, { message?: string }>>;

export interface TaskFormProps {
    register: (name: keyof TaskFormData, options?: object) => object;
    errors: FormErrors;
    buttonText: string;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isDisabled: boolean;
}

export type TaskFormData = z.input<typeof taskSchema>;

export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error'
}
export interface ToastProps {
    message: string;
    type: ToastType;
    show: boolean;
    setShow: (show: boolean) => void;
}