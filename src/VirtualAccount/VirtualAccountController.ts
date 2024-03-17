
import { Request, Response } from 'express';
import VirtualAccountService from './VirtualAccountService';
import { OK } from '../Resources/Constants/StatusCodes';
import UserService from '../User/UserService';

class VirtualCardController {

    async createVirtualCard(req: Request, res: Response) {
        try {
            //user object
            const user = await UserService.getUserByEmail('santos@gmail.com');

            await VirtualAccountService.createVirtualCard(user);
            return res.status(OK).json({
                message: 'Virtual account Created successfully.',
            });
        } catch (error: any) {
            return res.status(error?.status)
                .json({ message: error.message });
        }
    }

}


export default new VirtualCardController();

