import { type Task, ToastType } from '@/types';
import { TasksList } from "./TasksListComponent";
import taskService from '@/api/service';
import { useState, useEffect } from "react";
import { Toast } from '@/shared/components/Toast';
import { useNavigate } from "react-router-dom";

export function TaskListPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    
    const navigate = useNavigate();
    const updateTask = (taskId: string) => {
        navigate(`/edit-task/${taskId}`);
    }
    const deleteTask = async (taskId: string) => {
        try {
            await taskService.deleteTaskById(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
            setToastMessage('Task deleted successfully');
            setToastType(ToastType.SUCCESS);
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to delete task');
            setToastType(ToastType.ERROR);
            setShowToast(true);
        } finally {
            setTimeout(() => {
                setShowToast(false)
            }, 2000)
        }
    }
    useEffect(() => {
        taskService.getTasks().then((tasks: Task[]) => {
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