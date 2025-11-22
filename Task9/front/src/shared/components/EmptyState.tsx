import '../styles/empty-state.css';
import { useNavigate } from 'react-router-dom';

export function EmptyState({ message }: { message: string }) {
    const navigate = useNavigate();
    return (
        <div className="empty-state">
            <p>{message}</p>
            <p>Click the button below to create a new task</p>
            <button className="create-task-button" onClick={() => navigate('/tasks/create')}>
                Create Task
            </button>
        </div>
    );
}
