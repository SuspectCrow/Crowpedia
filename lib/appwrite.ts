import {Account, Avatars, Client, Databases, OAuthProvider, Query} from "react-native-appwrite";

import * as Linking from 'expo-linking'
import {openAuthSessionAsync} from "expo-web-browser";

export const config = {
    platform: 'com.suspectcrow.estateapp',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    CardsTableId: process.env.EXPO_PUBLIC_APPWRITE_CARDS_TABLE_ID,
}

export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

export const databases = new Databases(client);

export async function getCards({
                                   filter,
                                   query,
                                   limit,
                               }: {
    filter: string;
    query: string;
    limit?: number;
}) {
    try {
        const buildQuery = [Query.orderDesc("$createdAt")];

        if (filter && filter !== "All")
            buildQuery.push(Query.equal("type", filter));

        if (query)
            buildQuery.push(
                Query.or([
                    Query.search("title", query),
                    Query.search("type", query),
                ])
            );

        if (limit) buildQuery.push(Query.limit(limit));

        const result = await databases.listDocuments(
            config.databaseId!,
            config.CardsTableId!,
            buildQuery
        );

        return result.documents;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getCardById(id: string) {
    try {
        const result = await databases.getDocument(
            config.databaseId!,
            config.CardsTableId!,
            id
        );

        return result;

    } catch (error) {
        console.error("getCardById Failed:", error);
        return null;
    }
}

export async function updateCard(
    id: string,
    data: {
        title?: string,
        content?: string,
        background?: string,
        isLarge?: boolean
    }
) {
    try {
        const result = await databases.updateDocument(
            config.databaseId!,
            config.CardsTableId!,
            id,
            data
        );
        return result;
    } catch (error) {
        console.error("updateCard Failed:", error);
        return null;
    }
}