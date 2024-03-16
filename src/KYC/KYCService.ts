import {
    FLUTTERWAVE_SECRET_KEY,
    FLUTTERWAVE_BASE_URL
} from "../Resources/Constants/env";
import { createCustomAxiosInstance } from "../Resources/CommonFuntions";
import { HandleAppError } from "../Resources/exceptions/HandleAppError";



class KYCService {

    private KYC_ENDPOINT = '/bvn/verifications';

    async verifyBvnNumber() {

        const requestBody = {
            "bvn": "22360284478",
            "firstname": "Chukwuemeka",
            "lastname": "Chukwu"
        }

        console.log(FLUTTERWAVE_SECRET_KEY)

        const axiosInstance = createCustomAxiosInstance(`${FLUTTERWAVE_BASE_URL}`, {
            Authorization: `${FLUTTERWAVE_SECRET_KEY}`,
        });

        try {
            const response = await axiosInstance.post(`/bvn/verifications`,
                requestBody
            );

            const { status, data: { reference } } = response.data;

            console.log(response.data);

            if (status.toUpperCase() === 'SUCCESS') {
                // const bvnresponse = await axiosInstance.get(`/bvn/verifications/${reference}`);
                // console.log(bvnresponse);
            }

        } catch (error: any) {
            HandleAppError(error);
        }
    }

}


export default new KYCService;