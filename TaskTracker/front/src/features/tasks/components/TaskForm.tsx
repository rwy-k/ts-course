import '../styles/task-form.css';
import { Status, Priority, TaskType } from '@/features/tasks/enums';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/shared/helpers/validation';
import type { TaskFormData, User } from '../types';

interface TaskFormProps {
    buttonText: string;
    onSubmit: (data: TaskFormData) => void;
    defaultValues: TaskFormData;
    isEdit?: boolean;
    users: User[];
}

export function TaskForm({ buttonText, onSubmit, defaultValues, users, isEdit = false }: TaskFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
        reset,
    } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
        defaultValues,
    });
    const onFormSubmit = (data: TaskFormData) => {
        onSubmit(data);
        if (!isEdit) {
            reset();
        }
    };
    const isDisabled = !isDirty || !isValid;
    return (
        <form className="task-form" onSubmit={handleSubmit(onFormSubmit)}>
            <label htmlFor="title">Title</label>
            <input
                id="title"
                placeholder="Title"
                className={errors.title ? 'error' : ''}
                {...register('title', { required: true })}
            />
            {errors.title && <p className="error">{errors.title.message}</p>}

            <label htmlFor="description">Description</label>
            <input
                id="description"
                placeholder="Description"
                className={errors.description ? 'error' : ''}
                {...register('description')}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}

            <label htmlFor="deadline">Deadline</label>
            <input
                id="deadline"
                type="date"
                className={errors.deadline ? 'error' : ''}
                {...register('deadline', { required: true })}
            />
            {errors.deadline && <p className="error">{errors.deadline.message}</p>}

            <label htmlFor="status">Status</label>
            <select id="status" className={errors.status ? 'error' : ''} {...register('status', { required: true })}>
                <option value={Status.TODO}>Todo</option>
                <option value={Status.IN_PROGRESS}>In Progress</option>
                <option value={Status.IN_REVIEW}>Review</option>
                <option value={Status.DONE}>Done</option>
            </select>
            {errors.status && <p className="error">{errors.status.message}</p>}

            <label htmlFor="priority">Priority</label>
            <select
                id="priority"
                className={errors.priority ? 'error' : ''}
                {...register('priority', { required: true })}
            >
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
            </select>
            {errors.priority && <p className="error">{errors.priority.message}</p>}

            <label htmlFor="taskType">Task Type</label>
            <select id="taskType" className={errors.type ? 'error' : ''} {...register('type', { required: true })}>
                <option value={TaskType.TASK}>Task</option>
                <option value={TaskType.STORY}>Story</option>
                <option value={TaskType.EPIC}>Epic</option>
                <option value={TaskType.BUG}>Bug</option>
                <option value={TaskType.FEATURE}>Feature</option>
            </select>
            {errors.type && <p className="error">{errors.type.message}</p>}

            <label htmlFor="users">Assignee</label>
            <select id="users" className={errors.userId ? 'error' : ''} {...register('userId', { required: true })}>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
            {errors.userId && <p className="error">{errors.userId.message}</p>}

            <button type="submit" disabled={isDisabled}>
                {buttonText}
            </button>
        </form>
    );
}
