import '../styles/create-task.css';
import { TaskForm } from "../components/TaskForm";
import { type TaskFormData, Status, Priority } from "../types";
import { ToastType } from '@/shared/types';
import { Toast } from '@/shared/components/Toast';
import type { TaskService } from "../api";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

interface CreateTaskPageProps {
    taskService: TaskService;
}
export function CreateTaskPage({ taskService }: CreateTaskPageProps) {
    const navigate = useNavigate();
    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);

    const onSubmit = async (data: TaskFormData) => {
        try {
            await taskService.createTask({
                ...data,
                deadline: new Date(data.deadline),
                createdAt: new Date(),
                id: uuidv4(),
            });
            setToastMessage('Task created successfully');
            setToastType(ToastType.SUCCESS);
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to create task');
            setToastType(ToastType.ERROR);
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    }

    return (
        <div className="create-task-page">
            <div className="create-task-page-header">
                <h1>Create Task</h1>
            </div>
            <TaskForm buttonText="Create Task" onSubmit={onSubmit} defaultValues={{
                title: '',
                description: '',
                deadline: '',
                status: Status.TODO,
                priority: Priority.LOW,
            }} />
            <button onClick={() => navigate('/')}>Back</button>
            <Toast message={toastMessage} type={toastType} show={showToast} />
        </div>
    )
}