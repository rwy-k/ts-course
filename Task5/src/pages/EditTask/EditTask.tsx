import { useForm } from 'react-hook-form';
import type { Task } from '@/types';
import { taskSchema } from '@/shared/helpers/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDateForInput } from '@/shared/helpers/formatFields';
import { TaskForm } from '@/shared/components/TaskForm';
import { z } from 'zod';

type TaskFormData = z.input<typeof taskSchema>;
interface EditTaskProps {
    task: Task;
    editTask: (task: Task) => void;
}

export function EditTask({ task, editTask }: EditTaskProps) {
    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<TaskFormData>({
        mode: 'onBlur',
        defaultValues: {
            title: task.title,
            description: task.description,
            deadline: formatDateForInput(task.deadline),
            status: task.status,
            priority: task.priority,
        },
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

    const isDisabled = !isDirty || !isValid;

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