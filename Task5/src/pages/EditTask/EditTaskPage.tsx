import { EditTask } from './EditTask';
import { TaskService } from '@/api/service';
import { useEffect, useState } from 'react';
import { Toast } from '@/shared/Toast';
import { useParams } from 'react-router-dom';
import type { Task } from '@/types';

export function EditTaskPage() {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const editTask = async (task: Task) => {
        try {
            const taskService = new TaskService();
            await taskService.updateTask(id!, task);
            setToastMessage('Task updated successfully');
            setToastType('success')
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to update task');
            setToastType('error')
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false)
            }, 2000)
        }
    }

    useEffect(() => {
        if (!id) return;
        const taskService = new TaskService();
        taskService.getTaskById(id).then((task) => {
            setTask(task);
        });
    }, [id]);
    
    return (
        <>
            {task && <EditTask task={task} editTask={editTask} />}
            <Toast message={toastMessage} type={toastType} show={showToast} setShow={setShowToast} />
        </>
    )
}