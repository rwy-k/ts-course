import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTaskPage } from '../pages/UpdateTaskPage';
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
    priority: Priority.LOW,
    type: TaskType.TASK,
    userId: 'user-1',
};

const mockUsers = [
    { id: 'user-1', name: 'Test User 1' },
    { id: 'user-2', name: 'Test User 2' },
];

describe('UpdateTaskPage', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn((url: string | URL | Request) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockUsers,
                } as Response);
            }

            if (urlString.includes('/tasks/1') && !urlString.includes('edit')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockTask,
                } as Response);
            }

            return Promise.reject(new Error('Unknown endpoint'));
        }) as typeof fetch;
    });

    it('should render the update task page', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route path="/tasks/:id/edit" element={<UpdateTaskPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByRole('heading', { name: /update task/i })).toBeInTheDocument();
    });
    it('should render the back button', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route path="/tasks/:id/edit" element={<UpdateTaskPage />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(await screen.findByText('Back')).toBeInTheDocument();
    });
    it('submit button should be disabled if the form is invalid', async () => {
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route path="/tasks/:id/edit" element={<UpdateTaskPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /update task/i });
            expect(button).toBeDisabled();
        });
    });
    it('submit button should be enabled if the form is valid', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route path="/tasks/:id/edit" element={<UpdateTaskPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByPlaceholderText('Title'));

        await user.clear(screen.getByPlaceholderText('Title'));
        await user.type(screen.getByPlaceholderText('Title'), 'Updated Task');

        const button = screen.getByRole('button', { name: /update task/i });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });
    it('should show the toast when got an error updating a task', async () => {
        const user = userEvent.setup();
        globalThis.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockUsers,
                } as Response);
            }

            if (urlString.includes('/tasks/1') && options?.method !== 'PUT') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockTask,
                } as Response);
            }

            if (options?.method === 'PUT') {
                return Promise.resolve({
                    ok: false,
                    status: 400,
                    text: async () => 'Update failed',
                } as Response);
            }

            return Promise.reject(new Error('Unknown endpoint'));
        }) as typeof fetch;

        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route path="/tasks/:id/edit" element={<UpdateTaskPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByPlaceholderText('Title'));

        await user.clear(screen.getByPlaceholderText('Title'));
        await user.type(screen.getByPlaceholderText('Title'), 'Updated Task');
        await user.click(screen.getByRole('button', { name: /update task/i }));

        expect(await screen.findByText('Failed to update task')).toBeInTheDocument();
    });
    it('should show the toast when the task is updated successfully', async () => {
        const user = userEvent.setup();

        globalThis.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockUsers,
                } as Response);
            }

            if (urlString.includes('/tasks/1') && options?.method !== 'PUT') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockTask,
                } as Response);
            }

            if (options?.method === 'PUT') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ ...mockTask, title: 'Updated Task' }),
                } as Response);
            }

            return Promise.reject(new Error('Unknown endpoint'));
        }) as typeof fetch;

        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route path="/tasks/:id/edit" element={<UpdateTaskPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByPlaceholderText('Title'));

        await user.clear(screen.getByPlaceholderText('Title'));
        await user.type(screen.getByPlaceholderText('Title'), 'Updated Task');
        await user.click(screen.getByRole('button', { name: /update task/i }));

        expect(await screen.findByText('Task updated successfully')).toBeInTheDocument();
    });
});
