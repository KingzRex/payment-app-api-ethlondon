import axios from "axios";
import { FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_BASE_URL }
  from "../Resources/Constants/env";
import { v4 as uuidv4 } from 'uuid';
import { HandleAppError } from "../Resources/exceptions/HandleAppError";
import DbClient from "../Db/xataClient";
import { User } from "../User/UserTypes";
import { createCustomAxiosInstance } from "../Resources/CommonFuntions";

class VirtualAccountService {
  private VirtualAccountTable = DbClient.VirtualAccount;
  private VIRTUAL_ACCOUNT_ENDPOINT = '/virtual-account-numbers';

  async createVirtualCard(user: User) {

    const { id, email, firstName, lastName, phoneNumber, bvn } = user;
    const userId = id;
    const tx_ref = `TX_REF_${uuidv4()}`;
    const accountName = `${firstName} ${lastName}`;

    const requestBody = {
      "email": email,
      "is_permanent": true,
      "bvn": bvn,
      "tx_ref": tx_ref.toUpperCase(),
      "phonenumber": phoneNumber,
      "firstname": firstName,
      "lastname": lastName,
      "narration": `${accountName}`
    }

    const axiosInstance = createCustomAxiosInstance(`${FLUTTERWAVE_BASE_URL}`, {
      Authorization: `${FLUTTERWAVE_SECRET_KEY}`,
    });

    try {
      const response = await axiosInstance.post(`${this.VIRTUAL_ACCOUNT_ENDPOINT}`,
        requestBody
      );

      const { data: { account_number, bank_name, order_ref } } = response.data;
      const account = await this.storeVirtualAccount(
        {
          orderRef: order_ref,
          txRef: tx_ref,
          accountName,
          accountNumber: account_number,
          bankName: bank_name,
          userId
        });
      return true;
    } catch (error: any) {
      HandleAppError(error);
    }
  }



  async storeVirtualAccount(data: {
    txRef: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    userId: string;
    orderRef: string
  }) {
    const { txRef, accountName, accountNumber, bankName, userId, orderRef } = data;
    const newAccountName = `${accountName} FLW`;
    return this.VirtualAccountTable.create({
      txRef,
      accountName: newAccountName,
      accountNumber,
      bankName,
      user: userId,
      orderRef
    });
  }
}

export default new VirtualAccountService();
