import express from 'express';
import KYCService from './KYCService';

const KYCRouter = express.Router();

KYCRouter.post('/kyc', KYCService.verifyBvnNumber)

export default KYCRouter;