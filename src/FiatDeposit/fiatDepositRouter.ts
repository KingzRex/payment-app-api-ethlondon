import express from "express";
import FiatDepositController from "./FiatDepositController";
import { ValidateRequest } from "../Resources/middleware/ValidateRequest";
import { confirmFiatDepositRequest, createFiatDepositRequest } from "./fiatDepositSchema";
import { VerifyAccessToken } from "../Resources/middleware/verifyAuthToken";

const fiatDepositRouter = express.Router();

fiatDepositRouter
  .post(
    "/",
    ValidateRequest(createFiatDepositRequest),
    VerifyAccessToken,
    FiatDepositController.createDepositTransaction
  )
  .post(
    "/confirm",
    ValidateRequest(confirmFiatDepositRequest),
    VerifyAccessToken,
    FiatDepositController.confirmDepositTransaction
  )
  .get("/get-user-fiat-deposits", VerifyAccessToken, FiatDepositController.getUserDeposits);

export default fiatDepositRouter;
