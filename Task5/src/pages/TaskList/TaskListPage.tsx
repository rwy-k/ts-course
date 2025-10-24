import type { Task } from '@/types';
import { TasksList } from "./TasksListComponent";
import { TaskService } from '@/api/service';
import { useState, useEffect } from "react";
import { Toast } from '@/shared/Toast';
import { useNavigate } from "react-router-dom";

export function TaskListPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    
    const navigate = useNavigate();
    const updateTask = (taskId: string) => {
        navigate(`/edit-task/${taskId}`);
    }
    const deleteTask = async (taskId: string) => {
        try {
            const taskService = new TaskService();
            await taskService.deleteTaskById(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
            setToastMessage('Task deleted successfully');
            setToastType('success')
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to delete task');
            setToastType('error')
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false)
            }, 2000)
        }
    }
    useEffect(() => {
        const taskService = new TaskService();
        taskService.getTasks().then((tasks) => {
            setTasks(tasks);
        });
    }, []);
    return (
        <>
            <TasksList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
            <Toast message={toastMessage} type={toastType} show={showToast} setShow={setShowToast} />
        </>
    )
}