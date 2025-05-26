export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  EXCHANGE = 'exchange',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  WALLET = 'wallet',
  CRYPTO_WALLET = 'crypto_wallet',
}

export enum DeviceID {
  ANDROID = 'android',
  IOS = 'ios',
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  WEB_BROWSER = 'web_browser',
  TABLET = 'tablet',
  SMART_TV = 'smart_tv',
  GAMING_CONSOLE = 'gaming_console',
  SMART_WATCH = 'smart_watch',
  OTHER = 'other',
}
