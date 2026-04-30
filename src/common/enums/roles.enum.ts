export enum RoleEnum {
    SELLER_HEAD = 'آبشده فروش',
    WORKSHOP = 'کارگاه طلاسازی',
    BANKER = 'بنکدار',
    SHOP_OWNER = 'مغازه‌دار',
    CUSTOMER = 'مشتری',
}

export const ROLE_DISPLAY_NAMES = {
    [RoleEnum.SELLER_HEAD]: 'آبشده فروش (سر هرم)',
    [RoleEnum.WORKSHOP]: 'کارگاه طلاسازی',
    [RoleEnum.BANKER]: 'بنکدار',
    [RoleEnum.SHOP_OWNER]: 'مغازه‌دار محلی',
    [RoleEnum.CUSTOMER]: 'مشتری نهایی',
};