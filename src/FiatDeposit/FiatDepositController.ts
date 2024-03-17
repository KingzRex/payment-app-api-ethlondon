import { Response, Request } from "express";
import FiatDepositService from "./FiatDepositService";
import { requestUser } from "../Resources/requestHelpers/requestUser";
import { FiatDeposit } from "./fiatDepositSchema";
import { handleRequestError } from "../Resources/requestHelpers/handleRequestError";
import UserService from "../User/UserService";

class FiatDepositController {
  static instance: FiatDepositController | null = null;
  private static whitelistedBetaEmails = ["toochukwukingz6@gmail.com", "avoajajoshua@gmail.com"];

  static getInstance(): FiatDepositController {
    if (!FiatDepositController.instance) {
      FiatDepositController.instance = new FiatDepositController();
    }

    return FiatDepositController.instance;
  }

  private constructor() {}

  async createDepositTransaction(
    req: RequestWithBody<Pick<FiatDeposit, "fiatAmount" | "userWalletAddress">>,
    res: Response
  ) {
    try {
      const user = requestUser(req);

      const { fiatAmount, userWalletAddress } = req.body;

      if (!user.smartWalletAddress) {
        await UserService.updateSmartWalletAddress(user.id, userWalletAddress);
      }

      const deposit = await FiatDepositService.createDepositTransaction(user, fiatAmount);

      return res.status(201).json({
        message: "Deposit transaction created successfully",
        data: deposit,
      });
    } catch (err) {
      handleRequestError(err, res);
    }
  }

  async confirmDepositTransaction(req: RequestWithBody<{ depositId: string }>, res: Response) {
    try {
      const user = requestUser(req);

      if (!FiatDepositController.whitelistedBetaEmails.includes(user.email!)) {
        return res.status(401).json({
          message: "Your email is not whitelisted for beta",
        });
      }

      const { depositId } = req.body;

      await FiatDepositService.processDepositWalletCredit(depositId);

      return res.status(200).json({
        message: "Deposit completed successfully",
      });
    } catch (err) {
      handleRequestError(err, res);
    }
  }

  async getUserDeposits(req: Request, res: Response) {
    try {
      const user = requestUser(req);

      const deposits = await FiatDepositService.getUserDeposits(user.id);

      return res.status(200).json({ data: deposits });
    } catch (err) {
      handleRequestError(err, res);
    }
  }
}

export default FiatDepositController.getInstance();
