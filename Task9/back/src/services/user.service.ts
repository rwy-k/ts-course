import User from '../models/User.model.js';
import { IUser } from '../types/user.types.js';
import Task from '../models/Task.model.js';
export class UserService {
    private userModel: typeof User;
    constructor() {
        this.userModel = User;
    }

    async createUser(user: Partial<IUser>): Promise<IUser> {
        const newUser = await this.userModel.create(user);
        return newUser;
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await this.userModel.findAll({ include: [Task] });
        return users;
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await this.userModel.findByPk(id);
        return user;
    }

    async updateUser(id: string, user: Partial<IUser>): Promise<IUser | null> {
        const [affectedCount] = await this.userModel.update(user, { where: { id } });
        if (affectedCount === 0) {
            return null;
        }
        const updatedUser = await this.getUserById(id);
        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        await this.userModel.destroy({ where: { id } });
    }
}