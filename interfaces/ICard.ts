export enum CardVariant {
    SMALL = 'small',
    LARGE = 'large',
    MASONRY = 'masonry',
    DETAILED = 'detailed'
}

export const CARD_VARIANTS = {
    SMALL: CardVariant.SMALL,
    LARGE: CardVariant.LARGE,
    MASONRY: CardVariant.MASONRY,
    DETAILED: CardVariant.DETAILED
} as const;

export interface ICard {
    $id: string;
    index?: number;
    order: any;
    parentFolder?: string;
    title: any;
    content: string;
    type?: string;
    isFavorite?: boolean;
    variant?: CardVariant;
    background?: any;
    $createdAt: string;
    $updatedAt: string;
}