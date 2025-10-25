import '../styles/create-task.css';
import { TaskForm } from "../components/TaskForm";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type TaskFormData, Status, Priority } from "../types";
import { taskSchema } from "@/shared/helpers/validation";
import { Toast } from '@/shared/components/Toast';
import type { TaskService } from "../api";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export function CreateTaskPage({ taskService }: { taskService: TaskService }) {
    const navigate = useNavigate();
    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            deadline: '',
            status: Status.TODO,
            priority: Priority.LOW,
        },
    });


    const onSubmit = async (data: TaskFormData) => {
        try {
            await taskService.createTask({
                ...data,
                deadline: new Date(data.deadline),
                createdAt: new Date(),
                id: uuidv4(),
            });
            setToastMessage('Task created successfully');
            setToastType('success');
            setShowToast(true);
            reset();
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to create task');
            setToastType('error');
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    }

    const isDisabled = Object.keys(errors).length > 0 || !isDirty;

    return (
        <div className="create-task-page">
            <div className="create-task-page-header">
                <h1>Create Task</h1>
            </div>
            <TaskForm register={register} errors={errors} buttonText="Create Task" handleSubmit={handleSubmit(onSubmit)} isDisabled={isDisabled} />
            <button onClick={() => navigate('/')}>Back</button>
            <Toast message={toastMessage} type={toastType} show={showToast} />
        </div>
    )
}