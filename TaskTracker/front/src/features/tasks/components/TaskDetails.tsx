import '../styles/task-details.css';
import { formatTime, formatStatus, formatPriority } from '@/shared/helpers/formatFields';
import { useState, useEffect } from 'react';
import type { Task, User } from '../types';
import usersService from '@/api/users.controller';

export interface TaskDetailsProps {
    task: Task;
    deleteTask: (id: string) => void;
    updateTask: (id: string) => void;
}

export function TaskDetails({ task, deleteTask, updateTask }: TaskDetailsProps) {
    const [users, setUsers] = useState<User[]>([]);

    const findUserById = (id: string) => {
        return users.find((user) => user.id === id);
    };

    useEffect(() => {
        usersService.getUsers().then((users) => {
            setUsers(users);
        });
    }, []);

    return (
        <div className="task-details">
            <h1>Task Details</h1>
            <p>
                <strong>Title:</strong> {task.title}
            </p>
            <p>
                <strong>Description:</strong> {task.description}
            </p>
            <p>
                <strong>Deadline:</strong> {formatTime(task.deadline)}
            </p>
            <p>
                <strong>Status:</strong> {formatStatus(task.status)}
            </p>
            <p>
                <strong>Priority:</strong> {formatPriority(task.priority)}
            </p>
            <p>
                <strong>Created At:</strong> {formatTime(task.createdAt)}
            </p>
            <p>
                <strong>User:</strong> {findUserById(task.userId)?.name}
            </p>
            <div className="task-details-buttons">
                <button className="delete-button" onClick={() => deleteTask(task.id)}>
                    Delete
                </button>
                <button className="update-button" onClick={() => updateTask(task.id)}>
                    Update
                </button>
            </div>
        </div>
    );
}
