import { describe, it, expect, vi } from 'vitest';
import { CreateTaskPage } from '../pages/CreateTaskPage';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('CreateTaskPage', () => {
    it('should render the create task page', async () => {
        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );
        expect(await screen.findByRole('heading', { name: /create task/i })).toBeInTheDocument();
    });
    it('should render the back button', async () => {
        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );
        expect(await screen.findByText('Back')).toBeInTheDocument();
    });
    it('submit button should be disabled if the form is invalid', async () => {
        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );
        const button = await screen.findByRole('button', { name: /create task/i });
        expect(button).toBeDisabled();
    });
    it('submit button should be enabled if the form is valid', async () => {
        const user = userEvent.setup();

        // Mock fetch to return users
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ id: 'user-1', name: 'Test User' }],
        } as Response);

        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );

        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.tab();

        const button = screen.getByRole('button', { name: /create task/i });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });
    it('should show error when deadline is in the past', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );
        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2024-12-31');
        await user.tab();
        const button = screen.getByRole('button', { name: /create task/i });
        expect(button).toBeDisabled();
        expect(await screen.findByText('Deadline must be in the future')).toBeInTheDocument();
    });
    it('should show the toast when got an error creating a task', async () => {
        const user = userEvent.setup();

        globalThis.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ id: 'user-1', name: 'Test User' }],
                } as Response);
            }

            if (options?.method === 'POST') {
                return Promise.resolve({
                    ok: false,
                    status: 400,
                    text: async () => 'Create failed',
                } as Response);
            }

            return Promise.reject(new Error('Unknown endpoint'));
        }) as typeof fetch;

        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );

        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.tab();
        await user.click(screen.getByRole('button', { name: /create task/i }));

        expect(await screen.findByText('Failed to create task')).toBeInTheDocument();
    });
    it('should show the toast when the task is created successfully', async () => {
        const user = userEvent.setup();

        globalThis.fetch = vi.fn((url: string | URL | Request, options?: RequestInit) => {
            const urlString = url.toString();

            if (urlString.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ id: 'user-1', name: 'Test User' }],
                } as Response);
            }

            if (options?.method === 'POST') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        id: '1',
                        title: 'Test Task',
                        description: '',
                        deadline: new Date('2099-12-31'),
                        createdAt: new Date(),
                        status: 'TODO',
                        priority: 'LOW',
                        type: 'TASK',
                        userId: 'user-1',
                    }),
                } as Response);
            }

            return Promise.reject(new Error('Unknown endpoint'));
        }) as typeof fetch;

        render(
            <MemoryRouter>
                <CreateTaskPage />
            </MemoryRouter>,
        );

        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.tab();
        await user.click(screen.getByRole('button', { name: /create task/i }));

        expect(await screen.findByText('Task created successfully')).toBeInTheDocument();
    });
});
