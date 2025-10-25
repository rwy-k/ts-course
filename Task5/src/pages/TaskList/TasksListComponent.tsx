import type { Task } from '@/types';
import { formatPriority, formatStatus, formatTime } from '@/shared/helpers/formatFields';

export function TasksList({ tasks, updateTask, deleteTask }: { tasks: Task[], updateTask: (taskId: string, task: Task) => void, deleteTask: (taskId: string) => void }) {

    return (
        <table className="task-list">
            <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Delete</th>
                    <th scope="col">Update</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className="task-item">
                        <th scope="row">{task.title}</th>
                        <td>{task.description}</td>
                        <td>{formatTime(task.deadline)}</td>
                        <td>{formatStatus(task.status)}</td>
                        <td>{formatPriority(task.priority)}</td>
                        <td>
                            <button type="button" className="delete-task-button" onClick={() => deleteTask(task.id)}>Delete</button>
                        </td>
                        <td>
                            <button type="button" className="update-task-button" onClick={() => updateTask(task.id, task)}>Update</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}