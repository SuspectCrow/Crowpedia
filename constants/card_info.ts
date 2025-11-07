// typescript
// File: `constants/card_info.ts`

import icons from "@/constants/icons";

export const cardtypes = [
    "Folder",
    "Note",
    "Link",
    "Date",
    "Task",
    "Reminder"
] as const;

export const getCardIcon = (type: string | undefined) => {
    switch (type) {
        case "Folder":
            return icons.folder;
        case "Note":
            return icons.docs;
        case "Task":
            return icons.task;
        case "Link":
            return icons.link;
        case "Date":
            return icons.calendar_month;
        case "Reminder":
            return icons.reminder;
        default:
            return icons.docs;
    }
}