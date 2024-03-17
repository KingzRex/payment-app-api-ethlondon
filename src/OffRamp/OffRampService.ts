import { createCustomAxiosInstance } from "../Resources/CommonFuntions";
import { HandleAppError } from "../Resources/exceptions/HandleAppError";
import { OFF_RAMP_BASE_URL } from "../Resources/Constants/env"


class OffRampService {

    private OFFRAMP_ENDPOINT = '/yellowcard/withdraw-request';
    private BENEFICIARY_ENDPOINT = '/yellowcard/get-user-beneficiary';


    async GetUserBeneficiary(userId: string) {
        const axiosInstance = createCustomAxiosInstance(`${OFF_RAMP_BASE_URL}`);
        try {
            const response = await axiosInstance.get(`${this.BENEFICIARY_ENDPOINT}/${userId}`);
            return response.data;
        } catch (error: any) {
            HandleAppError(error);
        }
    }

    async Withdraw(data: {
        amount: string,
        beneficiaryId: string,
        shigaWalletAddressId: string,
        tokenName: string,
        chainName: string,
        userWalletAddress: string
    }) {

        const {
            amount,
            beneficiaryId,
            shigaWalletAddressId,
            tokenName,
            chainName,
            userWalletAddress
        } = data;

        const axiosInstance = createCustomAxiosInstance(`${OFF_RAMP_BASE_URL}`);

        const requestBody = {
            amount,
            beneficiaryId,
            shigaWalletAddressId,
            tokenName,
            chainName,
            userWalletAddress
        }

        try {
            const response = await axiosInstance.post(`${this.OFFRAMP_ENDPOINT}`,
                requestBody
            );
            return response;
        } catch (error: any) {
            HandleAppError(error);
        }
    }
}


export default new OffRampService();