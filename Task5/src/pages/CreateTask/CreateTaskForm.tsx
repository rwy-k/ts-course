import { useForm } from 'react-hook-form';
import type { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { taskSchema, type TaskFormData } from '@/helpers/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskForm } from '@/shared/TaskForm';
import { Status, Priority } from '@/types';

export function CreateTaskForm({ createTask }: { createTask: (task: Task) => void }) {
    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<TaskFormData>({
        mode: 'onBlur',
        defaultValues: {
            title: '',
            description: '',
            deadline: '',
            status: Status.TODO,
            priority: Priority.LOW,
        } as TaskFormData,
        resolver: zodResolver(taskSchema),
    });

    const onSubmit = (data: TaskFormData) => {
        createTask({
            ...data,
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