export interface ICard {
    id?: bigint;
    onPress?: () => void;
    title: any;
    cardType?: string;
    isFavorite?: boolean;
    isLarge?: boolean;
    background?: any;
}

export interface IFolder extends ICard {
    id?: bigint;
    parentFolder?: bigint;
}

export interface INote extends ICard {
    id?: bigint;
    content: string;
    parentFolder: bigint;
}