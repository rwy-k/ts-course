import { UserService } from "../services/user.service.js";
import { CustomError } from "../utils/customErrors.js";
import { Request, Response, NextFunction } from 'express';
import { IUser } from "../types/user.types.js";

export class UserController {
    constructor(private readonly userService: UserService) {}

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    }

    getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        const user = await this.userService.getUserById(id);
        res.status(200).json(user);
    }

    createUser = async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
        const user = req.body;
        const newUser = await this.userService.createUser(user);
        res.status(201).json(newUser);
    }

    updateUser = async (req: Request<{ id: string }, {}, IUser>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = req.body;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        const updatedUser = await this.userService.updateUser(id, user);
        res.status(200).json(updatedUser);
    }

    deleteUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id) {
            return next(new CustomError('ID is required', 400));
        }
        await this.userService.deleteUser(id);
        res.status(204).json({ message: 'User deleted successfully' });
    }
}