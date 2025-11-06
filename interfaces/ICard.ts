export interface ICard {
    $id: string;
    index?: number;
    order: any;
    title: any;
    type?: string;
    isFavorite?: boolean;
    isLarge?: boolean;
    background: any;
}

export interface IFolder extends ICard {
    $id: string;
    parentFolder?: bigint;
}

export interface INote extends ICard {
    $id: string;
    content: string;
    parentFolder: bigint;
}