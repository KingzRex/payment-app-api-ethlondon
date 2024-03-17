import { Request, Response, NextFunction } from 'express';
import { z } from "zod";
import { BAD_REQUEST } from '../Constants/StatusCodes';


const ValidateRequest = (schema: z.Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error: any) {
            const errorMessage = error.errors;
            const validationErrors = errorMessage.map((errorM: any) => errorM.message);
            return res.status(BAD_REQUEST).send({ error: validationErrors[0] });
        }
    };
};

export { ValidateRequest };
