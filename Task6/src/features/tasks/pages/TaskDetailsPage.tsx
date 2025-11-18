import '../styles/task-details.css';
import { TaskDetails } from '@/features/tasks/components/TaskDetails';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import taskService from '../api';
import type { Task } from '@/features/tasks/types';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';
import { ToastType } from '@/shared/types';

export function TaskDetailsPage() {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const navigate = useNavigate();
    const deleteTask = async (id: string) => {
        try {
            await taskService.deleteTaskById(id);
            setToastMessage('Task deleted successfully');
            setToastType(ToastType.SUCCESS);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to delete task');
            setToastType(ToastType.ERROR);
        } finally {
            setShowToast(true);
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
    }, [id]);
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