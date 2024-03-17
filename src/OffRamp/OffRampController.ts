import { Request, Response } from "express";
import OffRampService from "./OffRampService";
import { OK } from "../Resources/Constants/StatusCodes";
import { handleRequestError } from "../Resources/requestHelpers/handleRequestError";
import { requestUser } from "../Resources/requestHelpers/requestUser";

const WHITELISTED_DEMO_BENEFICIARY_SOURCE: Record<string, string> = {
    "toochukwukingz6@gmail.com": "rec_ckikq29d5eq6jed4kcng",
    "avoajajoshua@gmail.com": "rec_ckd0regidssv33u52ad0",
}

class OffRampController {
    async GetUserBeneficiary(req: Request, res: Response) {
        try {
            const user = requestUser(req);
            
            const whitelistedUserId = WHITELISTED_DEMO_BENEFICIARY_SOURCE[user.email!];

            if (!whitelistedUserId) return res.status(200).json({ data: [] });
            
            const data = await OffRampService.GetUserBeneficiary(whitelistedUserId);

            return res.status(200).json(data);
        } catch (error) {
            handleRequestError(error, res);
        }
    }

    async Withdraw(req: Request, res: Response) {
        const { amount, beneficiaryId, shigaWalletAddressId, tokenName, chainName, userWalletAddress } = req.body;

        try {
            const data = await OffRampService.Withdraw({
                amount,
                beneficiaryId,
                shigaWalletAddressId,
                tokenName,
                chainName,
                userWalletAddress,
            });
            return res.status(OK).json({ message: "success", data });
        } catch (error) {
            handleRequestError(error, res);
        }
    }
}

export default new OffRampController();
