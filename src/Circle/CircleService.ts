import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import {
  APP_ENV,
  CIRCLE_API_KEY,
  CIRCLE_DEV_WALLET_ID,
  CIRCLE_DEV_WALLET_SET_ID,
  CIRCLE_ENTITY_SECRET,
} from "../Resources/Constants/env";
import forge from "node-forge";
import { Blockchain } from "@circle-fin/developer-controlled-wallets/dist/types/clients/developer-controlled-wallets";

class CircleService {
  static instance: CircleService | null = null;

  static usdcTokenAddress: string =
    APP_ENV === "development"
      ? "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97"
      : "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

  static getInstance(): CircleService {
    if (!CircleService.instance) {
      CircleService.instance = new CircleService();
    }

    return CircleService.instance;
  }

  private constructor() {}

  private static developerSdk = initiateDeveloperControlledWalletsClient({
    apiKey: CIRCLE_API_KEY,
    entitySecret: CIRCLE_ENTITY_SECRET,
  });

  async getPublicKey() {
    const response = await CircleService.developerSdk.getPublicKey();

    const publicKey = response.data?.publicKey;

    if (!publicKey) throw new Error("No Public Key found");

    return publicKey;
  }

  async generateEntitySecretCipherText() {
    const retrievedPubKey = await this.getPublicKey();

    const entitySecret = forge.util.hexToBytes(CIRCLE_ENTITY_SECRET);

    const publicKey = forge.pki.publicKeyFromPem(retrievedPubKey);

    const encryptedData = publicKey.encrypt(entitySecret, "RSA-OAEP", {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    });

    return forge.util.encode64(encryptedData);
  }

  async getWalletUsdcBalance() {
    const balances = await CircleService.developerSdk.getWalletTokenBalance({
      id: CIRCLE_DEV_WALLET_ID,
      tokenAddresses: [CircleService.usdcTokenAddress],
    });

    const tokenBalances = balances.data?.tokenBalances;

    if (!tokenBalances) throw new Error("Balances response not found");

    const usdcBalance = tokenBalances.find(
      (balance) =>
        balance.token?.tokenAddress?.toLocaleLowerCase() === CircleService.usdcTokenAddress.toLocaleLowerCase()
    );

    if (!usdcBalance) throw new Error("USDC balance not found");

    return usdcBalance;
  }

  async transferUsdcToken(destinationWalletAddress: string, amount: number) {
    const usdcBalance = await this.getWalletUsdcBalance();

    const response = await CircleService.developerSdk.createTransaction({
      walletId: CIRCLE_DEV_WALLET_ID,
      tokenId: usdcBalance.token.id,
      destinationAddress: destinationWalletAddress,
      amount: [`${amount}`],
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    });

    const transactionState = response.data?.state;

    console.log({ transactionState });

    return transactionState;
  }

  async initializeDevWallet() {
    const walletSetId = CIRCLE_DEV_WALLET_SET_ID ?? (await this.createNewWalletSet());

    return await this.createNewDevWallet(walletSetId);
  }

  async createNewWalletSet() {
    const response = await CircleService.developerSdk.createWalletSet({
      name: "Payment App Wallet Set",
    });

    const walletSetId = response.data?.walletSet?.id;

    if (!walletSetId) throw new Error("No Wallet Set ID found");

    return walletSetId;
  }

  async createNewDevWallet(walletSetId: string) {
    const primaryBlockchain: Blockchain = APP_ENV === "development" ? "MATIC-MUMBAI" : "MATIC";

    const response = await CircleService.developerSdk.createWallets({
      walletSetId,
      accountType: "SCA",
      blockchains: [primaryBlockchain],
      count: 1,
    });

    const wallets = response.data?.wallets;

    if (!wallets) throw new Error(`Error creating wallets with walletSetId: ${walletSetId}`);

    return wallets;
  }
}

export default CircleService.getInstance();