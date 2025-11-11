import './style.css'
import { TaskService } from './service'
import type { Task } from './types'
import { Status, Priority } from './types'
import { v4 as uuidv4 } from 'uuid'

const taskService = new TaskService()

const printTasks = (tasks: Task[]) => {
  document.querySelector<HTMLDivElement>('#task-list')!.innerHTML = `
    <div class="task-list">
      ${tasks.sort((a: Task, b: Task) => a.title.localeCompare(b.title)).map((task: Task) => `<form id="edit-task-form-${task.id}"></form>`).join('')}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.sort((a: Task, b: Task) => a.title.localeCompare(b.title)).map((task: Task) => `<tr data-task-id="${task.id}">
            <td> <input type="text" name="title" value="${task.title}" form="edit-task-form-${task.id}" oninput="clearError(); clearSuccess();" /></td>
            <td> <input type="text" name="description" value="${task.description}" form="edit-task-form-${task.id}" oninput="clearError(); clearSuccess();" /></td>
            <td> <input type="date" name="deadline" value="${new Date(task.deadline).toISOString().split('T')[0]}" form="edit-task-form-${task.id}" oninput="clearError(); clearSuccess();" /></td>
            <td> <select name="status" form="edit-task-form-${task.id}" oninput="clearError(); clearSuccess();">
              <option value="${Status.TODO}" ${task.status === Status.TODO ? 'selected' : ''}>Todo</option>
              <option value="${Status.IN_PROGRESS}" ${task.status === Status.IN_PROGRESS ? 'selected' : ''}>In Progress</option>
              <option value="${Status.DONE}" ${task.status === Status.DONE ? 'selected' : ''}>Done</option>
            </select></td>
            <td> <select name="priority" form="edit-task-form-${task.id}" oninput="clearError(); clearSuccess();">
              <option value="${Priority.LOW}" ${task.priority === Priority.LOW ? 'selected' : ''}>Low</option>
              <option value="${Priority.MEDIUM}" ${task.priority === Priority.MEDIUM ? 'selected' : ''}>Medium</option>
              <option value="${Priority.HIGH}" ${task.priority === Priority.HIGH ? 'selected' : ''}>High</option>
            </select></td>
            <td><button class="delete-btn" data-task-id="${task.id}">Delete</button></td> 
            <td><button type="submit" form="edit-task-form-${task.id}" class="edit-btn" data-task-id="${task.id}">Save</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `
}

const getTasks = () => {
  return taskService.getTasks().then(tasks => {
    printTasks(tasks)
  })
  .catch((error) => {
    console.error('Error getting tasks', error)
    document.getElementById('error-message')!.textContent = error.message
  })
}

const createTask = (event: Event) => {
  event.preventDefault()
  const data = new FormData(event.target as HTMLFormElement)
  const task = Object.fromEntries(data) as unknown as Task;

  taskService.createTask({...task, id: uuidv4(), createdAt: new Date()})
    .then(() => {
      return getTasks()
    }).then(() => {
      document.getElementById('success-message')!.textContent = 'Task created successfully!'
    })
    .catch((error) => {
      console.error('Error creating task', error)
      document.getElementById('error-message')!.textContent = error.message
    })
}

const deleteTask = (event: Event) => {
  const taskId = event.target as HTMLElement
  const taskIdValue = taskId.getAttribute('data-task-id')
  if (taskIdValue) {
    taskService.deleteTaskById(taskIdValue).then(() => {
      return getTasks();
    }).then(() => {
      document.getElementById('success-message')!.textContent = 'Task deleted successfully!'
    }).catch((error) => {
      console.error('Error deleting task', error)
      document.getElementById('error-message')!.textContent = error.message
    });
  } else {
    console.error('Task ID not found')
  }
}

const editTask = (event: Event) => {
  event.preventDefault()
  const form = event.target as HTMLFormElement
  const taskIdValue = form.id.replace('edit-task-form-', '')
  
  if (taskIdValue) {
    console.log('Editing task:', taskIdValue);
    
    const data = new FormData(form)
    const task = Object.fromEntries(data) as unknown as Task;
    console.log('Task data:', task);
    
    taskService.updateTask(taskIdValue, task)
      .then(() => {
        console.log('Task updated successfully')
        getTasks()
      })
      .then(() => {
        document.getElementById('success-message')!.textContent = 'Task updated successfully!'
      })
      .catch((error) => {
        console.error('Error editing task', error)
        document.getElementById('error-message')!.textContent = error.message
      })
  }
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  
  if (target.classList.contains('delete-btn')) {
    deleteTask(event)
  }
})

document.addEventListener('submit', (event) => {
  const target = event.target as HTMLElement
  
  if (target.id && target.id.startsWith('edit-task-form-')) {
    editTask(event)
  }
})

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('task-form')?.addEventListener('submit', createTask);
  getTasks()
})
