import { useForm } from 'react-hook-form';
import type { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { taskSchema } from '@/shared/helpers/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskForm } from '@/shared/components/TaskForm';
import { Status, Priority } from '@/types';
import type { TaskFormData } from '@/types';

export function CreateTaskForm({ createTask }: { createTask: (task: Task) => void }) {
    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            deadline: '',
            status: Status.TODO,
            priority: Priority.LOW,
        },
    });

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
        reset();
    }

    const isDisabled = Object.keys(errors).length > 0 || !isDirty;
    
    return (
        <TaskForm 
            register={register} 
            errors={errors} 
            buttonText="Create Task" 
            handleSubmit={handleSubmit(onSubmit)} 
            isDisabled={isDisabled} 
        />
    )
}