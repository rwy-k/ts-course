import { createBrowserRouter } from 'react-router-dom';
import { TasksListPage } from './features/tasks/pages/TasksListPage';
import { TaskDetailsPage } from '@/features/tasks/pages/TaskDetailsPage';
import { CreateTaskPage } from '@/features/tasks/pages/CreateTaskPage';
import { UpdateTaskPage } from '@/features/tasks/pages/UpdateTaskPage';
import taskService from '@/features/tasks/api';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <TasksListPage taskService={taskService} />,
    },
    {
        path: '/tasks/:id',
        element: <TaskDetailsPage taskService={taskService} />,
    },
    {
        path: '/tasks/create',
        element: <CreateTaskPage taskService={taskService} />,
    },
    {
        path: '/tasks/update/:id',
        element: <UpdateTaskPage taskService={taskService} />,
    },
]);