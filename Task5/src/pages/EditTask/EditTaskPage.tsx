import { EditTask } from './EditTask';
import taskService from '@/api/service';
import { useEffect, useState } from 'react';
import { Toast } from '@/shared/components/Toast';
import { useParams } from 'react-router-dom';
import { type Task, ToastType } from '@/types';

export function EditTaskPage() {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);

    const editTask = async (task: Task) => {
        try {
            await taskService.updateTask(task);
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
                setShowToast(false)
            }, 2000)
        }
    }

    useEffect(() => {
        if (!id) return;
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