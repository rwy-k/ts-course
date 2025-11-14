import type { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import type { TaskFormData } from '@/shared/helpers/validation';
import { TaskForm } from '@/shared/components/TaskForm';
import { Status, Priority } from '@/types';

export interface CreateTaskProps {
    createTask: (task: Task) => void;
}

export function CreateTaskForm({ createTask }: CreateTaskProps) {
    const onSubmit = (data: TaskFormData) => {
        createTask({
            title: data.title,
            description: data.description ?? '',
            deadline: new Date(data.deadline),
            status: data.status,
            priority: data.priority,
            id: uuidv4(),
            createdAt: new Date(),
        });
    }
    
    return (
        <TaskForm 
            buttonText="Create Task" 
            onSubmit={onSubmit} 
            defaultValues={{
                title: '',
                description: '',
                deadline: '',
                status: Status.TODO,
                priority: Priority.LOW,
            }}
        />
    )
}