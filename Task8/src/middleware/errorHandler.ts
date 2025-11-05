import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customErrors.js";

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.status).json({error: err.message});
    } else {
        res.status(500).json({error: 'Server error'});
    }
};