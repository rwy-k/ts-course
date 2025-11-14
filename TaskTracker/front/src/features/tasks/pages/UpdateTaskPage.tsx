import '../styles/update-task.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TaskService } from '@/api/task.controller';
import type { Task, TaskFormData } from '@/features/tasks/types';
import { TaskForm } from '../components/TaskForm';
import { Toast } from '@/shared/components/Toast';
import { EmptyState } from '@/shared/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { taskSchema } from '@/shared/helpers/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formatDateForInput } from '@/shared/helpers/formatFields';
import type { User } from '../types';
import { UsersService } from '@/api/users.controller';
import { Loader } from '@/shared/components/Loader';
import { ToastType } from '@/shared/types';

export function UpdateTaskPage({ taskService }: { taskService: TaskService }) {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
        setValue,
    } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
    });

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersService = new UsersService();
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
            .then((task) => {
                setTask(task);
                setValue('title', task.title);
                setValue('description', task.description);
                setValue('deadline', formatDateForInput(task.deadline));
                setValue('status', task.status);
                setValue('priority', task.priority);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                setToastMessage('Failed to get task');
                setToastType(ToastType.ERROR);
                setShowToast(true);
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
    const isDisabled = !isDirty || !isValid;
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
                            register={register}
                            errors={errors}
                            buttonText="Update Task"
                            handleSubmit={handleSubmit(onSubmit)}
                            isDisabled={isDisabled}
                            users={users}
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
