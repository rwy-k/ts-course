import '../styles/task-details.css';
import { TaskDetails } from '@/features/tasks/components/TaskDetails';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TaskService } from '@/features/tasks/api';
import type { Task } from '@/features/tasks/types';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';

export function TaskDetailsPage({ taskService }: { taskService: TaskService }) {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const navigate = useNavigate();
    const deleteTask = async (id: string) => {
        try {
            await taskService.deleteTaskById(id);
            setToastMessage('Task deleted successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to delete task');
            setToastType('error');
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    };
    const updateTask = (id: string) => {
        navigate(`/tasks/update/${id}`);
    };
    useEffect(() => {
        if (!id) return;
        taskService.getTaskById(id).then((task) => {
            setTask(task);
        }).catch(() => {
            setTask(null);
        });
    }, [id, taskService]);
    return (
        <div className="task-details-page">
            {task 
             ? <TaskDetails task={task} deleteTask={deleteTask} updateTask={updateTask} />
             : <EmptyState message="Task not found" />
             }
            <button onClick={() => navigate('/')}>Back</button>
            <Toast message={toastMessage} type={toastType} show={showToast} />
    </div>
    )
}