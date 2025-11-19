import '@testing-library/jest-dom/vitest';
import { vi, beforeEach } from 'vitest';

// Mock global fetch for all tests
globalThis.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation for fetch (returns empty array for users)
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
        status: 200,
        statusText: 'OK',
    } as Response);
});
