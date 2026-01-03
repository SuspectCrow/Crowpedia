import { IconName } from "@/components/S_SCCard";

export enum CardVariant {
  SMALL = "small",
  LARGE = "large",
  PORTRAIT = "portrait",
}

export const CARD_VARIANTS = {
  SMALL: CardVariant.SMALL,
  LARGE: CardVariant.LARGE,
  PORTRAIT: CardVariant.PORTRAIT,
} as const;

export enum CardType {
  FOLDER = "Folder",
  NOTE = "Note",
  LINK = "Link",
  SIMPLE_TASK = "SimpleTask",
  TASK_LIST = "TaskList",
  OBJECTIVE = "Objective",
  ROUTINE = "Routine",
  EVENT = "Event",
  COLLECTION = "Collection",
  PASSWORD = "Password",
}

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

export const getCardIcon = (type: string | undefined): IconName => {
  const iconMap: Record<string, IconName> = {
    Folder: "folder",
    Note: "note",
    Link: "link",
    SimpleTask: "task-alt",
    TaskList: "checklist",
    Objective: "insert-chart-outlined",
    Event: "event",
    Collection: "collections-bookmark",
    Password: "password",
  };
  return iconMap[type || ""] || "note";
};

export interface CardTypeProps {
  card: ICard;
  className?: string;
}
