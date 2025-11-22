import '../styles/task-form.css';
import { Status, Priority } from '@/features/tasks/enums';
import type { TaskFormProps } from '@/features/tasks/types';

export function TaskForm({ register, errors, buttonText, handleSubmit, isDisabled }: TaskFormProps) {
    return (
        <form className="task-form" onSubmit={handleSubmit}>
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

            <button type="submit" disabled={isDisabled}>
                {buttonText}
            </button>
        </form>
    );
}
