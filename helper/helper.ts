import { PaymentMethodType } from "@/types/enums/UserEnums";

export const getPaymentMethodName = (type: PaymentMethodType): string => {
  const typeMap: Record<PaymentMethodType, string> = {
    [PaymentMethodType.CARD]: 'Credit/Debit Card',
    [PaymentMethodType.BANK_ACCOUNT]: 'Bank Account',
    [PaymentMethodType.WALLET]: 'Digital Wallet',
    [PaymentMethodType.CRYPTO_WALLET]: 'Cryptocurrency Wallet',
  };

  return typeMap[type] || type;
};
