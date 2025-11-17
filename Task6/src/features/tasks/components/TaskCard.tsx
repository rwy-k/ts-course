import { formatTime, formatStatus, formatPriority } from '@/shared/helpers/formatFields';
import type { Task } from '../types';

interface TaskCardProps {
    task: Task;
    viewTask: (id: string) => void;
}
export function TaskCard({ task, viewTask }: TaskCardProps) {
    return (
        <div className="task-card" onClick={() => viewTask(task.id)}>
            <h1 data-testid="task-title">{task.title}</h1>
            <p data-testid="task-deadline"><strong>Deadline:</strong> {formatTime(task.deadline)}</p>
            <p data-testid="task-status"><strong>Status:</strong> {formatStatus(task.status)}</p>
            <p data-testid="task-priority"><strong>Priority:</strong> {formatPriority(task.priority)}</p> 
        </div>
    )
}