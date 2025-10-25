import { useState } from 'react';
import { CreateTaskForm } from './CreateTaskForm';
import { type Task } from '@/types';
import { TaskService } from '@/api/service';
import { Toast } from '@/shared/components/Toast';

export function CreateTaskPage() {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const createTask = async (task: Task) => {
        try {
            const taskService = new TaskService();
            await taskService.createTask(task);
            setToastMessage('Task created successfully');
            setToastType('success')
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to create task');
            setToastType('error')
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