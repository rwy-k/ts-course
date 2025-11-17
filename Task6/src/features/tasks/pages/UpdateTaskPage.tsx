import '../styles/update-task.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TaskService } from '@/features/tasks/api';
import type { Task, TaskFormData } from '@/features/tasks/types';
import { TaskForm } from '../components/TaskForm';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { formatDateForInput } from '@/shared/helpers/formatFields';
import { ToastType } from '@/shared/types';

interface UpdateTaskPageProps {
    taskService: TaskService;
}
export function UpdateTaskPage({ taskService }: UpdateTaskPageProps) {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        taskService.getTaskById(id).then((task) => {
            setTask(task);
        });
    }, [id, taskService]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            await taskService.updateTask({
                ...task!,
                ...data,
                deadline: new Date(data.deadline),
            });
            setToastMessage('Task updated successfully');
            setToastType(ToastType.SUCCESS);
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to update task');
            setToastType(ToastType.ERROR);
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    }

    return (
        <div className="update-task-page">
            <div className="update-task-page-header">
                <h1>Update Task</h1>
            </div>
            {task 
            ? <TaskForm buttonText="Update Task" onSubmit={onSubmit} isEdit={true} defaultValues={{
                title: task.title,
                description: task.description,
                deadline: formatDateForInput(task.deadline),
                status: task.status,
                priority: task.priority,
            }} /> 
            : <EmptyState message="Task not found" />}
            <button onClick={() => navigate(`/tasks/${id}`)}>Back</button>
            <Toast message={toastMessage} type={toastType} show={showToast} />
        </div>
    )
}