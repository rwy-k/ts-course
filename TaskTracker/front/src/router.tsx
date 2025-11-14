import { createBrowserRouter } from 'react-router-dom';
import { TasksListPage } from './features/tasks/pages/TasksListPage';
import { TaskDetailsPage } from '@/features/tasks/pages/TaskDetailsPage';
import { CreateTaskPage } from '@/features/tasks/pages/CreateTaskPage';
import { UpdateTaskPage } from '@/features/tasks/pages/UpdateTaskPage';
import { TaskService } from '@/api/task.controller';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <TasksListPage taskService={new TaskService()} />,
    },
    {
        path: '/tasks/:id',
        element: <TaskDetailsPage taskService={new TaskService()} />,
    },
    {
        path: '/tasks/create',
        element: <CreateTaskPage taskService={new TaskService()} />,
    },
    {
        path: '/tasks/update/:id',
        element: <UpdateTaskPage taskService={new TaskService()} />,
    },
]);
