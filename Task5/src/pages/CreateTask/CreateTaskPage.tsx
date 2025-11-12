import { useState, useMemo } from 'react';
import { CreateTaskForm } from './CreateTaskForm';
import { type Task, ToastType } from '@/types';
import { TaskService } from '@/api/service';
import { Toast } from '@/shared/components/Toast';

export function CreateTaskPage() {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);

    const taskService = useMemo(() => new TaskService(), []);

    const createTask = async (task: Task) => {
        try {
            await taskService.createTask(task);
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
                setShowToast(false)
            }, 2000)
        }
    }
    return (
        <>
            <CreateTaskForm createTask={createTask} />
            <Toast message={toastMessage} type={toastType} show={showToast} setShow={setShowToast} />
        </>
    )
}