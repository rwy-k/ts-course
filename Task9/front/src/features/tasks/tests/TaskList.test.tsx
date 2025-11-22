import { render, screen } from '@testing-library/react';
import { TasksListPage } from '../pages/TasksListPage';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Status, Priority } from '../enums';
import type { TaskService } from '../api';

const mockTasks = [
    {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        createdAt: new Date(),
        deadline: new Date(),
        status: Status.TODO,
        priority: Priority.HIGH,
    },
    {
        id: '2',
        title: 'Test Task 2',
        description: 'Test Description 2',
        createdAt: new Date(),
        deadline: new Date(),
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
    },
    {
        id: '3',
        title: 'Test Task 3',
        description: 'Test Description 3',
        createdAt: new Date(),
        deadline: new Date(),
        status: Status.DONE,
        priority: Priority.LOW,
    },
];
const TasksListPageMemoryRouter = (mockTaskService: Partial<TaskService>) => {
    return (
        <MemoryRouter>
            <TasksListPage taskService={mockTaskService as TaskService} />
        </MemoryRouter>
    );
};
describe('TasksListPage', () => {
    it('should render the tasks list page', () => {
        const mockTaskService: Partial<TaskService> = {
            getTasks: vi.fn().mockResolvedValue(mockTasks),
        };
        render(<TasksListPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(screen.getByText('Tasks List')).toBeInTheDocument();
        expect(screen.getAllByText('Create Task').length).toBeGreaterThan(0);
    });
    it('should render the tasks list', () => {
        const mockTaskService: Partial<TaskService> = {
            getTasks: vi.fn().mockResolvedValue([]),
        };
        render(<TasksListPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(screen.getByText('Tasks List')).toBeInTheDocument();
    });
    it('should render the empty state', () => {
        const mockTaskService: Partial<TaskService> = {
            getTasks: vi.fn().mockResolvedValue([]),
        };
        render(<TasksListPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(screen.getByText('No tasks found')).toBeInTheDocument();
        expect(screen.getByText('Click the button below to create a new task')).toBeInTheDocument();
        expect(screen.getAllByText('Create Task').length).toBe(2);
    });

    it('should render the task cards with the correct data', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTasks: vi.fn().mockResolvedValue(mockTasks),
        };
        render(<TasksListPageMemoryRouter mockTaskService={mockTaskService} />);

        expect(await screen.findAllByTestId('task-title')).toHaveLength(3);
        expect((await screen.findAllByTestId('task-title'))[0]).toHaveTextContent('Test Task');
        expect(screen.getAllByTestId('task-deadline')).toHaveLength(3);
        expect(screen.getAllByTestId('task-status')).toHaveLength(3);
        expect(screen.getAllByTestId('task-priority')).toHaveLength(3);
    });

    it('should show the toast when got an error fetching tasks', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTasks: vi.fn().mockRejectedValue(new Error('Failed to get tasks')),
        };
        render(<TasksListPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(await screen.findByText('Failed to get tasks')).toBeInTheDocument();
    });
});
