
import z from 'zod'


export const OffRampSchema = z.object({
    body: z.object({
        amount: z.string({ 'required_error': 'amount is required' }),
        beneficiaryId: z.string({ 'required_error': 'beneficiary is required' }),
        shigaWalletAddressId: z.string({ 'required_error': 'shigaWallet Address Id is required' }),
        tokenName: z.string({ 'required_error': 'token name is required' }),
        chainName: z.string({ 'required_error': 'chain name is required' }),
        userWalletAddress: z.string({ "required_error": "user wallet address is required" }),
    })
});


export const BeneficiarySchema = z.object({
    params: z.object({
        userId: z.string({ 'required_error': 'user id is required' })
    })
})
