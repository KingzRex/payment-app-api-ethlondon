import express from 'express';
import VirtualCardController from './VirtualAccountController';
import { ValidateRequest } from '../Resources/middleware/ValidateRequest';
import {} from './VirtualAccountSchema';

const VirtualCardRouter = express.Router();

VirtualCardRouter.get('/create-virtual-account', VirtualCardController.createVirtualCard)



export default VirtualCardRouter;