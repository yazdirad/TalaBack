export enum TransactionTypeEnum {
    PURCHASE = 'PURCHASE',
    SALE = 'SALE',
    TRANSFER = 'TRANSFER',
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatusEnum {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    DISPUTED = 'disputed',
    ON_HOLD = 'on_hold',
}

export enum PaymentMethodEnum {
    WALLET_TRANSFER = 'WALLET_TRANSFER',
    CASH = 'CASH',
    CHEQUE = 'CHEQUE',
    BANK_TRANSFER = 'BANK_TRANSFER',
}