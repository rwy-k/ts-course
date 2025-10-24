import './styles/App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CreateTaskPage } from './pages/CreateTask/CreateTaskPage'
import { TaskListPage } from './pages/TaskList/TaskListPage';
import { Layout } from './shared/Layout'
import { EditTaskPage } from './pages/EditTask/EditTaskPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Layout />
        <TaskListPage />
      </>
    ),
  },
  {
    path: '/create-task',
    element: (
      <>
        <Layout />
        <CreateTaskPage />
      </>
    ),
  },
  {
    path: '/edit-task/:id',
    element: (
      <>
        <Layout />
        <EditTaskPage />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
