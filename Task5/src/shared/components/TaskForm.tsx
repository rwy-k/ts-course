import { Status, Priority } from '@/types';
import type { TaskFormData } from '@/shared/helpers/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/shared/helpers/validation';
interface TaskFormProps {
    buttonText: string;
    onSubmit: (data: TaskFormData) => void;
    defaultValues: TaskFormData;
    isEdit?: boolean;
}

export function TaskForm({ buttonText, onSubmit, defaultValues, isEdit = false }: TaskFormProps) {
    const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
        defaultValues,
    });
    const onFormSubmit = (data: TaskFormData) => {
        onSubmit(data);
        if (!isEdit) {
            reset();
        }
    }
    const isDisabled = !isDirty || !isValid;

    return (
        <form className="task-form" onSubmit={handleSubmit(onFormSubmit)}>
            <label htmlFor="title">Title</label>
            <input id="title" placeholder="Title" className={errors.title ? 'error' : ''} {...register('title', { required: true })} />
            {errors.title && <p className="error">{errors.title.message}</p>}

            <label htmlFor="description">Description</label>
            <input id="description" placeholder="Description" className={errors.description ? 'error' : ''} {...register('description')} />
            {errors.description && <p className="error">{errors.description.message}</p>}

            <label htmlFor="deadline">Deadline</label>
            <input id="deadline" type="date" className={errors.deadline ? 'error' : ''} {...register('deadline', { required: true })} />
            {errors.deadline && <p className="error">{errors.deadline.message}</p>}

            <label htmlFor="status">Status</label>
            <select id="status" className={errors.status ? 'error' : ''} {...register('status', { required: true })}>
                <option value={Status.TODO}>Todo</option>
                <option value={Status.IN_PROGRESS}>In Progress</option>
                <option value={Status.DONE}>Done</option>
            </select>
            {errors.status && <p className="error">{errors.status.message}</p>}

            <label htmlFor="priority">Priority</label>
            <select id="priority" className={errors.priority ? 'error' : ''} {...register('priority', { required: true })}>
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
            </select>
            {errors.priority && <p className="error">{errors.priority.message}</p>}

            <button type="submit" disabled={isDisabled}>{buttonText}</button>
        </form>
    )
}