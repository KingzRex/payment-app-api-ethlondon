import CircleService from "../Circle/CircleService";
import { User } from "../Db/xata";
import DbClient from "../Db/xataClient";
import { HttpException } from "../Resources/exceptions/HttpExceptions";
import { FiatDepositStatus } from "./fiatDepositSchema";

const DUMMY_NGN_DEPOSIT_RATE = 1500;
const FEE_PERCENTAGE = 0.2 / 100; // 0.2 %

class FiatDepositService {
  static instance: FiatDepositService | null = null;

  static getInstance(): FiatDepositService {
    if (!FiatDepositService.instance) {
      FiatDepositService.instance = new FiatDepositService();
    }

    return FiatDepositService.instance;
  }

  private FiatDepositTable = DbClient.FiatDepositTransaction;

  async createDepositTransaction(user: User, fiatAmount: number) {
    const rate = await this.getFiatRate();
    const feePercent = await this.getFeePercent();
    const fee = feePercent * fiatAmount;

    const calculatedCryptoAmount = (fiatAmount - fee) / rate;

    const deposit = await this.FiatDepositTable.create({
      user: user.id,
      fiatAmount,
      fiatRate: rate,
      cryptoAmount: Number(calculatedCryptoAmount.toFixed(4)),
    });

    return deposit;
  }

  async markDepositAsProcessing(depositId: string) {
    const deposit = await this.FiatDepositTable.read(depositId);

    if (!deposit) throw new Error("Deposit not found");

    await deposit.update({
      status: FiatDepositStatus.processed,
    });
  }

  async processDepositWalletCredit(depositId: string) {
    const deposit = await this.FiatDepositTable.read(depositId);

    if (!deposit) throw new Error("Deposit not found");

    const userData = await deposit.user?.read();

    if (!userData) {
      throw new Error("User not found");
    }

    if (deposit.status === FiatDepositStatus.completed) {
      throw new HttpException(400, "Deposit already completed", { depositId });
    }

    await CircleService.transferUsdcToken(userData.smartWalletAddress, deposit.cryptoAmount);

    await deposit.update({
      status: FiatDepositStatus.completed,
    });
  }

  async getFeePercent() {
    return Promise.resolve(FEE_PERCENTAGE);
  }

  async getFiatRate() {
    return Promise.resolve(DUMMY_NGN_DEPOSIT_RATE);
  }

  async getUserDeposits(userId: string) {
    const deposits = await this.FiatDepositTable.filter({
      user: userId,
    })
      .sort("xata.createdAt", "desc")
      .getAll();

    return deposits;
  }
}

export default FiatDepositService.getInstance();
