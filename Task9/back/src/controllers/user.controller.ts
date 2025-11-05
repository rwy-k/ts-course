import { UserService } from "../services/user.service.js";
import { CustomError } from "../utils/customErrors.js";
import { Request, Response, NextFunction } from 'express';
import { IUser } from "../types/user.types.js";

export class UserController {
    constructor(private readonly userService: UserService) {}

    async getUsers(req: Request, res: Response) {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        const user = await this.userService.getUserById(id);
        res.status(200).json(user);
    }

    async createUser(req: Request, res: Response) {
        const user = req.body as IUser;
        const newUser = await this.userService.createUser(user);
        res.status(201).json(newUser);
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const user = req.body as IUser;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        const updatedUser = await this.userService.updateUser(id, user);
        res.status(200).json(updatedUser);
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        await this.userService.deleteUser(id);
        res.status(204).json({ message: 'User deleted successfully' });
    }
}