import '../styles/update-task.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Task, TaskFormData } from '@/features/tasks/types';
import { TaskForm } from '../components/TaskForm';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';
import { formatDateForInput } from '@/shared/helpers/formatFields';
import type { User } from '../types';
import usersService from '@/api/users.controller';
import taskService from '@/api/task.controller';
import { Loader } from '@/shared/components/Loader';
import { ToastType } from '@/shared/types';
import { Status, Priority, TaskType } from '../enums';

export function UpdateTaskPage() {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const [defaultValues, setDefaultValues] = useState<TaskFormData>({
        title: '',
        description: '',
        deadline: '',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        userId: '',
    });
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        usersService.getUsers().then((users) => {
            setUsers(users);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        taskService
            .getTaskById(id)
            .then((task: Task) => {
                setTask(task);
                setDefaultValues({
                    title: task.title,
                    description: task.description,
                    deadline: formatDateForInput(task.deadline),
                    status: task.status,
                    priority: task.priority,
                    type: TaskType.TASK,
                    userId: task.userId,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                setToastMessage('Failed to get task');
                setToastType(ToastType.ERROR);
                setShowToast(true);
            });
    }, [id]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            await taskService.updateTask(id!, {
                ...task!,
                ...data,
                deadline: new Date(data.deadline),
            });
            setToastMessage('Task updated successfully');
            setToastType(ToastType.SUCCESS);
            setShowToast(true);
            setTimeout(() => {
                navigate(`/tasks/${id}`);
            }, 1000);
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
    };
    const navigate = useNavigate();
    return (
        <div className="update-task-page">
            {loading && <Loader loading={loading} />}
            {!loading && (
                <>
                    <div className="update-task-page-header">
                        <h1>Update Task</h1>
                    </div>
                    {task ? (
                        <TaskForm
                            buttonText="Update Task"
                            onSubmit={onSubmit}
                            defaultValues={defaultValues}
                            users={users}
                            isEdit={true}
                        />
                    ) : (
                        <EmptyState message="Task not found" />
                    )}
                    <button onClick={() => navigate(`/tasks/${id}`)}>Back</button>
                    <Toast message={toastMessage} type={toastType} show={showToast} />
                </>
            )}
        </div>
    );
}
