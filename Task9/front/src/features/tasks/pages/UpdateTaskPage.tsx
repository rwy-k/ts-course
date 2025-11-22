import '../styles/update-task.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TaskService } from '@/features/tasks/api';
import type { Task, TaskFormData } from '@/features/tasks/types';
import { TaskForm } from '../components/TaskForm';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { taskSchema } from '@/shared/helpers/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formatDateForInput } from '@/shared/helpers/formatFields';

export function UpdateTaskPage({ taskService }: { taskService: TaskService }) {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
    } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
    });

    useEffect(() => {
        if (!id) return;
        taskService.getTaskById(id).then((task) => {
            setTask(task);
            setValue('title', task.title);
            setValue('description', task.description);
            setValue('deadline', formatDateForInput(task.deadline));
            setValue('status', task.status);
            setValue('priority', task.priority);
        });
    }, [id, setValue, taskService]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            await taskService.updateTask(id!, {
                ...task!,
                ...data,
                deadline: new Date(data.deadline),
            });
            setToastMessage('Task updated successfully');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to update task');
            setToastType('error');
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    };
    const isDisabled = Object.keys(errors).length > 0 || !isDirty;
    return (
        <div className="update-task-page">
            <div className="update-task-page-header">
                <h1>Update Task</h1>
            </div>
            {task ? (
                <TaskForm
                    register={register}
                    errors={errors}
                    buttonText="Update Task"
                    handleSubmit={handleSubmit(onSubmit)}
                    isDisabled={isDisabled}
                />
            ) : (
                <EmptyState message="Task not found" />
            )}
            <button onClick={() => navigate(`/tasks/${id}`)}>Back</button>
            <Toast message={toastMessage} type={toastType} show={showToast} />
        </div>
    );
}
