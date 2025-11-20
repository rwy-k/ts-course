import { render, screen } from '@testing-library/react';
import { TasksListPage } from '../pages/TasksListPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Status, Priority, TaskType } from '../enums';

const mockTasks = [
    {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        createdAt: new Date('2024-01-01'),
        deadline: new Date('2099-12-31'),
        status: Status.TODO,
        priority: Priority.HIGH,
        type: TaskType.TASK,
        userId: 'user-1',
    },
    {
        id: '2',
        title: 'Test Task 2',
        description: 'Test Description 2',
        createdAt: new Date('2024-01-02'),
        deadline: new Date('2099-12-31'),
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        type: TaskType.TASK,
        userId: 'user-1',
    },
    {
        id: '3',
        title: 'Test Task 3',
        description: 'Test Description 3',
        createdAt: new Date('2024-01-03'),
        deadline: new Date('2099-12-31'),
        status: Status.DONE,
        priority: Priority.LOW,
        type: TaskType.TASK,
        userId: 'user-1',
    },
];

describe('TasksListPage', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: async () => [],
            } as Response),
        ) as typeof fetch;
    });

    it('should render the tasks list page', async () => {
        render(
            <MemoryRouter>
                <TasksListPage />
            </MemoryRouter>,
        );
        expect(await screen.findByText('Tasks List')).toBeInTheDocument();
        expect(screen.getAllByText('Create Task').length).toBeGreaterThan(0);
    });
    it('should render the tasks list', async () => {
        render(
            <MemoryRouter>
                <TasksListPage />
            </MemoryRouter>,
        );
        expect(await screen.findByText('Tasks List')).toBeInTheDocument();
    });
    it('should render the empty state', async () => {
        render(
            <MemoryRouter>
                <TasksListPage />
            </MemoryRouter>,
        );
        expect(await screen.findByText('No tasks found')).toBeInTheDocument();
        expect(screen.getByText('Click the button below to create a new task')).toBeInTheDocument();
        expect(screen.getAllByText('Create Task').length).toBe(2);
    });

    it('should render the task cards with the correct data', async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: async () => mockTasks,
            } as Response),
        ) as typeof fetch;

        render(
            <MemoryRouter>
                <TasksListPage />
            </MemoryRouter>,
        );

        expect(await screen.findAllByTestId('task-title')).toHaveLength(3);
        expect((await screen.findAllByTestId('task-title'))[0]).toHaveTextContent('Test Task');
        expect(screen.getAllByTestId('task-deadline')).toHaveLength(3);
        expect(screen.getAllByTestId('task-priority')).toHaveLength(3);
    });

    it('should show the toast when got an error fetching tasks', async () => {
        globalThis.fetch = vi.fn(() => Promise.reject(new Error('Failed to fetch'))) as typeof fetch;

        render(
            <MemoryRouter>
                <TasksListPage />
            </MemoryRouter>,
        );
        expect(await screen.findByText('Failed to get tasks')).toBeInTheDocument();
    });
});
