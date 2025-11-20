import { createBrowserRouter } from 'react-router-dom';
import { TasksListPage } from './features/tasks/pages/TasksListPage';
import { TaskDetailsPage } from '@/features/tasks/pages/TaskDetailsPage';
import { CreateTaskPage } from '@/features/tasks/pages/CreateTaskPage';
import { UpdateTaskPage } from '@/features/tasks/pages/UpdateTaskPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <TasksListPage />,
    },
    {
        path: '/tasks/:id',
        element: <TaskDetailsPage />,
    },
    {
        path: '/tasks/create',
        element: <CreateTaskPage />,
    },
    {
        path: '/tasks/update/:id',
        element: <UpdateTaskPage />,
    },
]);
