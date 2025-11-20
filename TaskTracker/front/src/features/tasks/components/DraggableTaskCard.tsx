import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';
export interface TaskCardProps {
    task: Task;
    viewTask: (id: string) => void;
}

export function DraggableTaskCard({ task, viewTask }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: {
            task,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on drag handle
        if ((e.target as HTMLElement).closest('.drag-handle')) {
            return;
        }
        viewTask(task.id);
    };

    return (
        <div ref={setNodeRef} style={style} className="draggable-task-card">
            <div className="task-card" onClick={handleCardClick}>
                <div className="drag-handle" {...attributes} {...listeners} title="Drag to move task">
                    ⋮⋮
                </div>
                <TaskCard task={task} viewTask={viewTask} />
            </div>
        </div>
    );
}
