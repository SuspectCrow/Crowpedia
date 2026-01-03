import { ICard } from "@/interfaces/ICard";
import { TreeItem } from "@/components/Core/C_SCTreeView";

export const buildFolderTree = (cards: ICard[]): TreeItem[] => {
  const map: { [key: string]: TreeItem } = {};
  const tree: TreeItem[] = [];

  cards.forEach((card) => {
    map[card.$id] = {
      id: card.$id,
      name: card.title,
      children: [],
    };
  });

  cards.forEach((card) => {
    const item = map[card.$id];
    if (card.parentFolder && map[card.parentFolder]) {
      map[card.parentFolder].children?.push(item);
    } else {
      tree.push(item);
    }
  });

  const cleanTree = (items: TreeItem[]): TreeItem[] => {
    return items.map((item) => {
      const newItem = { ...item };
      if (newItem.children && newItem.children.length > 0) {
        newItem.children = cleanTree(newItem.children);
      } else {
        delete newItem.children;
      }
      return newItem;
    });
  };

  return cleanTree(tree);
};
