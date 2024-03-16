import { Request, Response } from "express";
import CircleService from "./CircleService";

class CircleController {
  static instance: CircleController | null = null;

  static getInstance(): CircleController {
    if (!CircleController.instance) {
      CircleController.instance = new CircleController();
    }

    return CircleController.instance;
  }

  private constructor() {}

  async generateEntitySecretCipherText(req: Request, res: Response) {
    const cipherText = await CircleService.generateEntitySecretCipherText();

    console.log({ cipherText });

    res.status(200).json({ cipherText });
  }

  async createDevWallet(req: Request, res: Response) {
    const wallets = await CircleService.initializeDevWallet();

    console.log({ wallets });

    res.status(200).json({ wallets });
  }
}

export default CircleController.getInstance();