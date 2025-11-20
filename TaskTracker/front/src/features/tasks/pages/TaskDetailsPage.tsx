import '../styles/task-details.css';
import { TaskDetails } from '@/features/tasks/components/TaskDetails';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Task } from '@/features/tasks/types';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';
import { Loader } from '@/shared/components/Loader';
import { ToastType } from '@/shared/types';
import taskService from '@/api/task.controller';

export function TaskDetailsPage() {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const deleteTask = async (id: string) => {
        if (isDeleting) return; // Prevent multiple clicks
        setIsDeleting(true);
        try {
            await taskService.deleteTaskById(id);
            setToastMessage('Task deleted successfully');
            setToastType(ToastType.SUCCESS);
            setShowToast(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to delete task');
            setToastType(ToastType.ERROR);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        } finally {
            setIsDeleting(false);
        }
    };
    const updateTask = (id: string) => {
        navigate(`/tasks/update/${id}`);
    };
    useEffect(() => {
        if (!id) return;
        taskService
            .getTaskById(id)
            .then((task) => {
                setTask(task);
                setLoading(false);
            })
            .catch(() => {
                setTask(null);
                setLoading(false);
            });
    }, [id]);
    return (
        <div className="task-details-page">
            {loading && <Loader loading={loading} />}
            {!loading && (
                <>
                    {task ? (
                        <TaskDetails task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ) : (
                        <EmptyState message="Task not found" />
                    )}
                    <button onClick={() => navigate('/')}>Back</button>
                    <Toast message={toastMessage} type={toastType} show={showToast} />
                </>
            )}
        </div>
    );
}
