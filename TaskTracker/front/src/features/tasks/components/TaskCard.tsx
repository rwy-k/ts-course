import { formatTime, formatPriority } from '@/shared/helpers/formatFields';
import type { Task } from '../types';

export interface TaskCardProps {
    task: Task;
    viewTask: (id: string) => void;
}

export function TaskCard({ task, viewTask }: TaskCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-dragging]')) {
            return;
        }
        viewTask(task.id);
    };

    return (
        <div onClick={handleClick}>
            <h1 data-testid="task-title">{task.title}</h1>
            <p data-testid="task-deadline">
                <strong>Deadline:</strong> {formatTime(task.deadline)}
            </p>
            <p data-testid="task-priority">
                <strong>Priority:</strong> {formatPriority(task.priority)}
            </p>
        </div>
    );
}
