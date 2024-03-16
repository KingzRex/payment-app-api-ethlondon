import express from 'express';
import KYCService from './KYCService';
// import VirtualCardController from './VirtualAccountController';
// import { ValidateRequest } from '../Resources/middleware/ValidateRequest';
// import {
//     // VirtualAccount,
// } from './VirtualAccountSchema';

const KYCRouter = express.Router();

KYCRouter
    .post('/kyc',
        // ValidateRequest(VirtualAccount),
        KYCService.verifyBvnNumber)



export default KYCRouter;