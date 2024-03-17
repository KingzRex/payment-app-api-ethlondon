import { Router } from "express";
import VirtualAccountRoutes from "../VirtualAccount/VirtualAccountRoutes";
import authRouter from "../Auth/authRouter";
import fiatDepositRouter from "../FiatDeposit/fiatDepositRouter";
import OffRampRouter from "../OffRamp/OfframpRoutes";

export const apiRoutes = Router()
    .use("/", VirtualAccountRoutes)
    .use("/auth", authRouter)
    .use("/deposit", fiatDepositRouter)
    .use("/offramp", OffRampRouter);