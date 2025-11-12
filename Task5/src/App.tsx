import './styles/App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CreateTaskPage } from './pages/CreateTask/CreateTaskPage'
import { TaskListPage } from './pages/TaskList/TaskListPage';
import { Layout } from './shared/components/Layout';
import { EditTaskPage } from './pages/EditTask/EditTaskPage';
import { Outlet } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Layout />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '',
        element: <TaskListPage />,
      },
      {
        path: 'create-task',
        element: <CreateTaskPage />,
      },
      {
        path: 'edit-task/:id',
        element: <EditTaskPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
