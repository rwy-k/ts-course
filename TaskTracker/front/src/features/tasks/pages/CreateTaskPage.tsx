import '../styles/create-task.css';
import { TaskForm } from '../components/TaskForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type TaskFormData } from '../types';
import { Status, Priority, TaskType } from '../enums';
import { taskSchema } from '@/shared/helpers/validation';
import { Toast } from '@/shared/components/Toast';
import type { TaskService } from '@/api/task.controller';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { UsersService } from '@/api/users.controller';
import { Loader } from '@/shared/components/Loader';
import { ToastType } from '@/shared/types';

export function CreateTaskPage({ taskService }: { taskService: TaskService }) {
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
        reset,
    } = useForm<TaskFormData>({
        mode: 'onBlur',
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            deadline: '',
            status: Status.TODO,
            priority: Priority.LOW,
            type: TaskType.TASK,
            userId: '',
        },
    });

    useEffect(() => {
        const usersService = new UsersService();
        usersService
            .getUsers()
            .then((users) => {
                setUsers(users);
                if (users.length > 0) {
                    reset({ userId: users[0].id }, { keepDefaultValues: true });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setToastMessage('Failed to get users');
                setToastType(ToastType.ERROR);
                setShowToast(true);
                setLoading(false);
            });
    }, [reset]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            await taskService.createTask({
                ...data,
                deadline: new Date(data.deadline),
                createdAt: new Date(),
                id: uuidv4(),
            });
            setToastMessage('Task created successfully');
            setToastType(ToastType.SUCCESS);
            setShowToast(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error(error);
            setToastMessage('Failed to create task');
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
        <div className="create-task-page">
            {loading && <Loader loading={loading} />}
            {!loading && (
                <>
                    <div className="create-task-page-header">
                        <h1>Create Task</h1>
                    </div>
                    <TaskForm
                        register={register}
                        errors={errors}
                        buttonText="Create Task"
                        handleSubmit={handleSubmit(onSubmit)}
                        isDisabled={isDisabled}
                        users={users}
                    />
                    <button onClick={() => navigate('/')}>Back</button>
                    <Toast message={toastMessage} type={toastType} show={showToast} />
                </>
            )}
        </div>
    );
}
