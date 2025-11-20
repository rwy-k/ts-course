import '../styles/create-task.css';
import { TaskForm } from '../components/TaskForm';
import { type TaskFormData } from '../types';
import { Status, Priority, TaskType } from '../enums';
import { Toast } from '@/shared/components/Toast';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { Loader } from '@/shared/components/Loader';
import { ToastType } from '@/shared/types';
import taskService from '@/api/task.controller';
import usersService from '@/api/users.controller';

export function CreateTaskPage() {
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        usersService
            .getUsers()
            .then((users) => {
                setUsers(users);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setToastMessage('Failed to get users');
                setToastType(ToastType.ERROR);
                setShowToast(true);
                setLoading(false);
            });
    }, []);

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

    return (
        <div className="create-task-page">
            {loading && <Loader loading={loading} />}
            {!loading && (
                <>
                    <div className="create-task-page-header">
                        <h1>Create Task</h1>
                    </div>
                    <TaskForm
                        buttonText="Create Task"
                        onSubmit={onSubmit}
                        defaultValues={{
                            title: '',
                            description: '',
                            deadline: '',
                            status: Status.TODO,
                            priority: Priority.LOW,
                            type: TaskType.TASK,
                            userId: '',
                        }}
                        users={users}
                    />
                    <button onClick={() => navigate('/')}>Back</button>
                    <Toast message={toastMessage} type={toastType} show={showToast} />
                </>
            )}
        </div>
    );
}
