import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Status, Priority, TaskType } from '../enums';

const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    deadline: new Date('2099-12-31'),
    createdAt: new Date('2024-01-01'),
    status: Status.TODO,
    priority: Priority.HIGH,
    type: TaskType.TASK,
    userId: 'user-1',
};

const mockUsers = [
    { id: 'user-1', name: 'Test User 1' },
    { id: 'user-2', name: 'Test User 2' },
];

describe('TaskDetailsPage', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn((url: string | URL | Request) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockUsers,
                } as Response);
            }

            return Promise.resolve({
                ok: true,
                json: async () => mockTask,
            } as Response);
        }) as typeof fetch;
    });

    it('should render the task details page', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByRole('heading', { name: /task details/i })).toBeInTheDocument();
    });
    it('should render the back button', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByText('Back')).toBeInTheDocument();
    });
    it('should render the delete button', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByText('Delete')).toBeInTheDocument();
    });
    it('should render the update button', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByText('Update')).toBeInTheDocument();
    });
    it('should show the toast when got an error deleting a task', async () => {
        const user = userEvent.setup();

        globalThis.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockUsers,
                } as Response);
            }

            if (options?.method === 'DELETE') {
                return Promise.resolve({
                    ok: false,
                    status: 400,
                    text: async () => 'Delete failed',
                } as Response);
            }

            return Promise.resolve({
                ok: true,
                json: async () => mockTask,
            } as Response);
        }) as typeof fetch;

        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByText('Delete'));
        await user.click(screen.getByText('Delete'));

        expect(await screen.findByText('Failed to delete task')).toBeInTheDocument();
    });
    it('should show the toast when the task is deleted successfully', async () => {
        const user = userEvent.setup();

        globalThis.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockUsers,
                } as Response);
            }

            if (options?.method === 'DELETE') {
                return Promise.resolve({
                    ok: true,
                    status: 204,
                    headers: new Headers({ 'content-length': '0' }),
                } as Response);
            }

            return Promise.resolve({
                ok: true,
                json: async () => mockTask,
            } as Response);
        }) as typeof fetch;

        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByText('Delete'));
        await user.click(screen.getByText('Delete'));

        expect(await screen.findByText('Task deleted successfully')).toBeInTheDocument();
    });
    it('should render the task details', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
    it('should show an empty state when the task is not found', async () => {
        globalThis.fetch = vi.fn(() => Promise.reject(new Error('Task not found'))) as typeof fetch;

        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByText('Task not found')).toBeInTheDocument();
    });
});
