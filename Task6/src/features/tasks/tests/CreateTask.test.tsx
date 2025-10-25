import { describe, it, expect } from 'vitest';
import { CreateTaskPage } from '../pages/CreateTaskPage';
import { TaskService } from '../api';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('CreateTaskPage', () => {
    it('should render the create task page', () => {
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        }
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading', { name: /create task/i })).toBeInTheDocument();
    });    
    it('should render the back button', () => {
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        }
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>
        );
        expect(screen.getByText('Back')).toBeInTheDocument();
    });
    it('submit button should be disabled if the form is invalid', () => {
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        }
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>
        );
        const button = screen.getByRole('button', { name: /create task/i });
        expect(button).toBeDisabled();
    });
    it('submit button should be enabled if the form is valid', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        }
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>
        );
        
        await user.type(screen.getByPlaceholderText('Title'), 'Test Task');
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        
        const button = screen.getByRole('button', { name: /create task/i });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });
    it('should show the toast when got an error creating a task', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockRejectedValue(new Error('Failed to create task')),
        }
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>
        );
        
        await user.type(screen.getByPlaceholderText('Title'), 'Test Task');
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.click(screen.getByRole('button', { name: /create task/i }));
        
        expect(await screen.findByText('Failed to create task')).toBeInTheDocument();
    });
    it('should show the toast when the task is created successfully', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        }
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>
        );
        
        await user.type(screen.getByPlaceholderText('Title'), 'Test Task');
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.click(screen.getByRole('button', { name: /create task/i }));
        
        expect(await screen.findByText('Task created successfully')).toBeInTheDocument();
    });
});