export interface ICard {
    $id: string;
    index?: number;
    order: any;
    parentFolder?: string;
    title: any;
    content: string;
    type?: string;
    isFavorite?: boolean;
    isLarge?: boolean;
    background?: any;
}