// typescript
// File: `constants/card_info.ts`


export const cardtypes = [
    "Folder",
    "Note",
    "Link",
    "SimpleTask",
    "TaskList",
    "Objective",
    "Routine",
    "Event",
    "Collection",
    "Password"
] as const;

export const getCardIcon = (type: string | undefined) => {
    switch (type) {
        case "Folder":
            return "folder";
        case "Note":
            return "note";
        case "Link":
            return "link";
        case "SimpleTask":
            return "task-alt";
        case "TaskList":
            return "checklist";
        case "Objective":
            return "insert-chart-outlined";
        case "Routine":
            return "notifications";
        case "Event":
            return "event";
        case "Collection":
                return "collections-bookmark";
        case "Password":
            return "password";
        default:
            return "note";
    }
}