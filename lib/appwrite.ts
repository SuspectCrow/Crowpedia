import {Account, Avatars, Client, Databases, OAuthProvider, Query} from "react-native-appwrite";

import * as Linking from 'expo-linking'
import {openAuthSessionAsync} from "expo-web-browser";

export const config = {
    platform: 'com.suspectcrow.estateapp',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    CardsTableId: process.env.EXPO_PUBLIC_APPWRITE_CARDS_TABLE_ID,
    FoldersTableId: process.env.EXPO_PUBLIC_APPWRITE_FOLDERS_TABLE_ID,
    NotesTableId: process.env.EXPO_PUBLIC_APPWRITE_NOTES_TABLE_ID

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


export async function getNotes({
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
            buildQuery.push(Query.equal("content", filter));

        if (query)
            buildQuery.push(
                Query.or([
                    Query.search("content", query)
                ])
            );

        if (limit) buildQuery.push(Query.limit(limit));

        const result = await databases.listDocuments(
            config.databaseId!,
            config.NotesTableId!,
            buildQuery
        );

        return result.documents;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getNoteById(id: string) {
    try {
        const result = await databases.getDocument(
            config.databaseId!,
            config.NotesTableId!,
            id
        );

        return result;

    } catch (error) {
        console.error("getNoteById Failed:", error);
        return null;
    }
}

export async function getFolders({
       limit,
   }: {
    limit?: number;
}) {
    try {
        const buildQuery = [Query.orderDesc("$createdAt")];

        if (limit) buildQuery.push(Query.limit(limit));

        const result = await databases.listDocuments(
            config.databaseId!,
            config.FoldersTableId!,
            buildQuery
        );

        return result.documents;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getFolderById(id: string) {
    try {
        const result = await databases.getDocument(
            config.databaseId!,
            config.FoldersTableId!,
            id
        );

        return result;

    } catch (error) {
        console.error("getNoteById Failed:", error);
        return null;
    }
}