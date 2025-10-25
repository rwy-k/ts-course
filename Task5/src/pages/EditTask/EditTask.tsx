import { useForm } from 'react-hook-form';
import type { Task } from '@/types';
import { taskSchema } from '@/shared/helpers/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDateForInput } from '@/shared/helpers/formatFields';
import { TaskForm } from '@/shared/components/TaskForm';
import type { TaskFormData } from '@/types';

export function EditTask({ task, editTask }: { task: Task, editTask: (task: Task) => void }) {
    const { register, handleSubmit, formState: { errors, isDirty } } = useForm<TaskFormData>({
        mode: 'onBlur',
        defaultValues: {
            title: task.title,
            description: task.description,
            deadline: formatDateForInput(task.deadline),
            status: task.status,
            priority: task.priority,
        } as TaskFormData,
        resolver: zodResolver(taskSchema),
    });

    const onSubmit = (data: TaskFormData) => {
        editTask({
            title: data.title,
            description: data.description ?? '',
            deadline: new Date(data.deadline),
            status: data.status,
            priority: data.priority,
            id: task.id,
            createdAt: task.createdAt,
        });
    }

    const isDisabled = Object.keys(errors).length > 0 || !isDirty;

    return (
        <TaskForm 
            register={register} 
            errors={errors} 
            buttonText="Edit Task" 
            handleSubmit={handleSubmit(onSubmit)} 
            isDisabled={isDisabled}
            />
    )
}