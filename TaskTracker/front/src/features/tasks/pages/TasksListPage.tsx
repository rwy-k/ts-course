import '../styles/task-list.css';
import { EmptyState } from '@/shared/components/EmptyState';
import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { useNavigate } from 'react-router-dom';
import type { TaskService } from '@/api/task.controller';
import { Toast } from '@/shared/components/Toast';
import { ToastType } from '@/shared/types';
import { Status } from '../enums';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { DraggableTaskCard } from '../components/DraggableTaskCard';
import { DroppableColumn } from '../components/DroppableColumn';
import { Loader } from '@/shared/components/Loader';

export function TasksListPage({ taskService }: { taskService: TaskService }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>(ToastType.SUCCESS);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        taskService
            .getTasks()
            .then((tasks) => {
                setTasks(tasks);
            })
            .catch((error) => {
                console.error(error);
                setToastMessage('Failed to get tasks');
                setToastType(ToastType.ERROR);
                setShowToast(true);
            })
            .finally(() => {
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
                setLoading(false);
            });
    }, [taskService]);

    const viewTask = (id: string) => {
        navigate(`/tasks/${id}`);
    };
    const navigate = useNavigate();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as Status;

        const task = tasks.find((t) => t.id === taskId);

        if (!task || task.status === newStatus) return;

        const updatedTask = { ...task, status: newStatus, description: task.description || '' };

        taskService
            .updateTask(taskId, updatedTask)
            .then(() => {
                setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? updatedTask : t)));
                setToastMessage('Task status updated successfully');
                setToastType(ToastType.SUCCESS);
                setShowToast(true);
            })
            .catch((error) => {
                console.error(error);
                setToastMessage('Failed to update task status');
                setToastType(ToastType.ERROR);
                setShowToast(true);
            })
            .finally(() => {
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
            });
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="tasks-list-page">
                {loading && <Loader loading={loading} />}
                {!loading && (
                    <>
                        <div className="tasks-list-page-header">
                            <h1>Tasks List</h1>
                            <button className="create-task-button" onClick={() => navigate('/tasks/create')}>
                                Create Task
                            </button>
                        </div>
                        <div className="tasks-list">
                            {tasks.length > 0 ? (
                                <div className="status-list-page">
                                    <div className="status-list">
                                        <DroppableColumn status={Status.TODO} title="Todo">
                                            {tasks
                                                .filter((task) => task.status === Status.TODO)
                                                .map((task) => (
                                                    <DraggableTaskCard key={task.id} task={task} viewTask={viewTask} />
                                                ))}
                                        </DroppableColumn>
                                        <DroppableColumn status={Status.IN_PROGRESS} title="In Progress">
                                            {tasks
                                                .filter((task) => task.status === Status.IN_PROGRESS)
                                                .map((task) => (
                                                    <DraggableTaskCard key={task.id} task={task} viewTask={viewTask} />
                                                ))}
                                        </DroppableColumn>
                                        <DroppableColumn status={Status.IN_REVIEW} title="Review">
                                            {tasks
                                                .filter((task) => task.status === Status.IN_REVIEW)
                                                .map((task) => (
                                                    <DraggableTaskCard key={task.id} task={task} viewTask={viewTask} />
                                                ))}
                                        </DroppableColumn>
                                        <DroppableColumn status={Status.DONE} title="Done">
                                            {tasks
                                                .filter((task) => task.status === Status.DONE)
                                                .map((task) => (
                                                    <DraggableTaskCard key={task.id} task={task} viewTask={viewTask} />
                                                ))}
                                        </DroppableColumn>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState message="No tasks found" />
                            )}
                        </div>
                        <Toast message={toastMessage} type={toastType} show={showToast} />
                    </>
                )}
            </div>
        </DndContext>
    );
}
