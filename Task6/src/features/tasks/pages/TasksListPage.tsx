import '../styles/task-list.css';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { useNavigate } from 'react-router-dom';
import type { TaskService } from '../api';
import { Toast } from '@/shared/components/Toast';
import type { ToastType } from '@/shared/types';

export function TasksListPage({ taskService }: { taskService: TaskService }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    useEffect(() => {
        taskService.getTasks().then((tasks) => {
            setTasks(tasks);
        }).catch((error) => {
            console.error(error);
            setToastMessage('Failed to get tasks');
            setToastType(ToastType.ERROR);
            setShowToast(true);
        }).finally(() => {
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        });
    }, []);

    const viewTask = (id: string) => {
        navigate(`/tasks/${id}`);
    }
    const navigate = useNavigate();

    return (
        <div className="tasks-list-page">
            <div className="tasks-list-page-header">
                <h1>Tasks List</h1>
                <button className="create-task-button" onClick={() => navigate('/tasks/create')}>Create Task</button>
            </div>
            <div className="tasks-list">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} viewTask={viewTask} />
                ))
            ) : (
                    <EmptyState message="No tasks found" />
                )}
            </div>
            <Toast message={toastMessage} type={toastType} show={showToast} />
        </div>
    )
}