import { useDroppable } from '@dnd-kit/core';
import type { DroppableColumnProps } from '../types';

export function DroppableColumn({ status, title, children }: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
        data: {
            status,
        },
    });

    const titleClassName = `status-item-title status-item-title-${status.toLowerCase().replace('_', '-')}`;

    return (
        <div className="status-item" ref={setNodeRef} style={{ backgroundColor: isOver ? '#646cff' : 'transparent' }}>
            <h3 className={titleClassName}>{title}</h3>
            <div className="status-item-tasks">{children}</div>
        </div>
    );
}
