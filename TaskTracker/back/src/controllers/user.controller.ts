import { UserService } from '../services/user.service.js';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user.types.js';

export class UserController {
    constructor(private readonly userService: UserService) {}

    getUsers = async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    };

    getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return next(error);
        }
    };

    createUser = async (req: Request<object, object, IUser>, res: Response, next: NextFunction) => {
        const user = req.body;
        try {
            const newUser = await this.userService.createUser(user);
            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            return next(error);
        }
    };

    updateUser = async (req: Request<{ id: string }, object, IUser>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = req.body;
        try {
            const updatedUser = await this.userService.updateUser(id, user);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return next(error);
        }
    };

    deleteUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            await this.userService.deleteUser(id);
            res.status(204).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    };
}
