import { z } from "zod";

export enum FiatDepositStatus {
  pending = "pending",
  completed = "completed",
  processed = "processing",
}

export const fiatDepositSchema = z.object({
  fiatAmount: z.number().positive(),
  cryptoAmount: z.number().positive(),
  fiatRate: z.number().positive(),
  status: z.enum(["pending", "completed", "processing"]),
  userWalletAddress: z.string()
});

export const createFiatDepositRequest = z.object({
  body: fiatDepositSchema.pick({
    fiatAmount: true,
    userWalletAddress: true
  }),
});

export const confirmFiatDepositRequest = z.object({
  body: z.object({
    depositId: z.string(),
  }),
});

export type FiatDeposit = z.infer<typeof fiatDepositSchema>;
