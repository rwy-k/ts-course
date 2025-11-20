import { API_URL } from '@/shared/constants';
import type { User } from '@/features/tasks/types';
class UsersService {
    private readonly API_URL = `${API_URL}/users`;
    async getUsers(): Promise<User[]> {
        try {
            return fetch(`${this.API_URL}`).then((res) => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new UsersService();
