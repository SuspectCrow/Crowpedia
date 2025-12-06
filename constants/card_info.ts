// typescript
// File: `constants/card_info.ts`

import icons from "@/constants/icons";

export const cardtypes = [
    "Folder",
    "Note",
    "Link",
    "SimpleTask",
    "TaskList",
    "Objective",
    "Routine",
    "Event",
    "Collection"
] as const;

export const getCardIcon = (type: string | undefined) => {
    switch (type) {
        case "Folder":
            return icons.folder;
        case "Note":
            return icons.docs;
        case "Link":
            return icons.link;
        case "SimpleTask":
            return icons.select_check_box;
        case "TaskList":
            return icons.checklist;
        case "Objective":
            return icons.reminder;
        case "Routine":
            return icons.reminder;
        case "Event":
            return icons.calendar_month;
        default:
            return icons.docs;
    }
}