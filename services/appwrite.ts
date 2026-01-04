import { Client, Databases, ID, Query, Models } from "react-native-appwrite";
import { ICard, CardVariant } from "@/interfaces/ICard";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  cardsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CARDS_TABLE_ID!,
};

const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

client.setPlatform("com.suspectcrow.Crowpedia");

const databases = new Databases(client);
type NewCardPayload = Omit<ICard, "$id" | "$createdAt" | "$updatedAt">;

/**
 * @param data Card data
 */
export async function createCard(data: NewCardPayload): Promise<Models.Document> {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cardsCollectionId,
      ID.unique(),
      {
        title: data.title,
        content: data.content,
        type: data.type,
        order: data.order,
        parentFolder: data.parentFolder || "home",
        isFavorite: data.isFavorite || false,
        variant: data.variant || CardVariant.SMALL,
        background: data.background || null,
      },
    );
    return response;
  } catch (error) {
    console.error("createCard Error:", error);
    throw error;
  }
}

/**
 * @param options Search and filtering options
 */
export async function getCards(options?: {
  searchTerm?: string;
  filterType?: string;
  parentFolder?: string;
  limit?: number;
  offset?: number;
}): Promise<ICard[]> {
  try {
    const queries = [Query.orderDesc("$createdAt")];

    if (options?.filterType && options.filterType !== "All") {
      queries.push(Query.equal("type", options.filterType));
    }

    if (options?.searchTerm) {
      queries.push(Query.search("title", options.searchTerm));
    }

    if (options?.limit) {
      queries.push(Query.limit(options.limit));
    }

    if (options?.offset) {
      queries.push(Query.offset(options.offset));
    }

    if (options?.parentFolder) {
      queries.push(Query.equal("parentFolder", options.parentFolder));
    }

    const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.cardsCollectionId, queries);

    return result.documents as unknown as ICard[];
  } catch (error: any) {
    console.error("getCards Hatası Detay:", {
      message: error.message,
      code: error.code,
      type: error.type,
      options,
    });
    throw error;
  }
}

/**
 * @param documentId ID of the card
 */
export async function getCardById(documentId: string): Promise<ICard | null> {
  try {
    const result = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.cardsCollectionId, documentId);
    return result as unknown as ICard;
  } catch (error) {
    console.error("getCardById Hatası:", error);
    return null;
  }
}

/**
 * Partial<ICard> allows us to send only the changed fields.
 * @param documentId ID of the card to be updated
 * @param updates Data to be updated
 */
export async function updateCard(documentId: string, updates: Partial<ICard>): Promise<Models.Document> {
  try {
    const { $id, $createdAt, $updatedAt, ...cleanUpdates } = updates;

    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cardsCollectionId,
      documentId,
      cleanUpdates,
    );
    return result;
  } catch (error) {
    console.error("updateCard Hatası:", error);
    throw error;
  }
}

/**
 * @param documentId ID of the card to be deleted
 */
export async function deleteCard(documentId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.cardsCollectionId, documentId);
    return true;
  } catch (error) {
    console.error("deleteCard Hatası:", error);
    return false;
  }
}

/**
 * @param type Desired card type
 * @param limit Optional: How many to bring
 */
export async function getCardsByType(type: string, limit?: number): Promise<ICard[]> {
  return await getCards({
    filterType: type,
    limit: limit,
  });
}

/**
 * @param folderId Folder id
 */
export async function getCardsInFolder(folderId: string): Promise<ICard[]> {
  return await getCards({
    parentFolder: folderId,
    limit: 100,
  });
}

export async function getAllFolders(): Promise<ICard[]> {
  try {
    const queries = [Query.equal("type", "Folder"), Query.limit(1000)];

    const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.cardsCollectionId, queries);

    return result.documents as unknown as ICard[];
  } catch (error) {
    console.error("getAllFolders Hatası:", error);
    throw error;
  }
}
