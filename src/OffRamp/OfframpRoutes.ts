import express from 'express';
import OffRampController from './OffRampController';
import { ValidateRequest } from '../Resources/middleware/ValidateRequest';
import {
    OffRampSchema,
} from './OffRampSchema';
import { VerifyAccessToken } from '../Resources/middleware/verifyAuthToken';

const OffRampRouter = express.Router();

OffRampRouter
    .post('/withdraw',
        ValidateRequest(OffRampSchema),
        OffRampController.Withdraw
    )
    .get('/get-beneficiaries',
        VerifyAccessToken,
        OffRampController.GetUserBeneficiary
    )



export default OffRampRouter;