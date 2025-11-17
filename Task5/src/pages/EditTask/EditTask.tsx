import type { Task } from '@/types';
import { type TaskFormData } from '@/shared/helpers/validation';
import { formatDateForInput } from '@/shared/helpers/formatFields';
import { TaskForm } from '@/shared/components/TaskForm';
interface EditTaskProps {
    task: Task;
    editTask: (task: Task) => void;
}

export function EditTask({ task, editTask }: EditTaskProps) {
    const onSubmit = (data: TaskFormData) => {
        editTask({
            id: task.id,
            description: data.description ?? '',
            deadline: new Date(data.deadline),
            status: data.status,
            priority: data.priority,
            createdAt: task.createdAt,
            title: data.title,
        });
    }

    return (
        <TaskForm 
            buttonText="Edit Task" 
            onSubmit={onSubmit} 
            defaultValues={{
                title: task.title,
                description: task.description,
                deadline: formatDateForInput(task.deadline),
                status: task.status,
                priority: task.priority,
            }}
            isEdit={true}
            />
    )
}