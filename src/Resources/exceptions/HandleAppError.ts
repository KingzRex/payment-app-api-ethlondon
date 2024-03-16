import { Response } from 'express';
import { HttpException } from "./HttpExceptions";
import { BAD_REQUEST } from "../Constants/StatusCodes";

export function HandleAppError(error: any, res?: Response) {
    // Handle errors based on their type and context:
    if (error.response && error.response.status === 400) {
        const apiError = error.response.data;
        throw new HttpException(error?.response?.status ?? BAD_REQUEST, apiError.message);
    } else {
        throw new HttpException(error?.status ?? BAD_REQUEST, error.message);
    }
}