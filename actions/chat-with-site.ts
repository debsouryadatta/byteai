"use server";

import { db } from "@/lib/db";
import { generatePageSummary } from "@/lib/openai";
import { auth } from '@clerk/nextjs/server'


export const fetchWebsitesAction = async (sortBy: string = 'newest', searchQuery: string = '') => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        let orderBy: { [key: string]: 'asc' | 'desc' } = {};
        switch (sortBy) {
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'name':
                orderBy = { name: 'asc' };
                break;
        }

        const websites = await db.website.findMany({
            where: {
                userId,
                ...(searchQuery.length > 0 ? {
                    OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { url: { contains: searchQuery, mode: 'insensitive' } }
                    ]
                } : {})
            },
            orderBy
        });
        
        return websites;
    } catch (error) {
        console.log("Error fetching websites:", error);
        throw error;
    }
}

export const createWebsiteAction = async (url: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        let pageContent: any = await fetch(`${process.env.CRAWL4AI_BE_URL}/crawl?url=${url}`)
        pageContent = await pageContent.json()
        const pageSummary = await generatePageSummary(pageContent.markdown)

        const website = await db.website.create({
            data: {
                userId: userId,
                name: url,
                url: url,
                pageContent: pageContent.markdown,
                pageSummary: pageSummary,
            }
        })
        return website;
    } catch (error) {
        console.log("Error creating website:", error);
        throw error;
    }
}

export const deleteWebsiteAction = async (websiteId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const website = await db.website.delete({
            where: { id: websiteId, userId: userId }
        })
        return website;
    } catch (error) {
        console.log("Error deleting website:", error);
        throw error;
    }
}

export const updateWebsiteNameAction = async (websiteId: string, name: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const website = await db.website.update({
            where: { id: websiteId, userId: userId },
            data: { name: name }
        })
        return website;
    } catch (error) {
        console.log("Error updating website name:", error);
        throw error;
    }
}

export const fetchWebsiteByIdAction = async (websiteId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const website = await db.website.findUnique({
            where: { id: websiteId, userId: userId }
        })
        return website;
    } catch (error) {
        console.log("Error fetching website:", error);
        throw error;
    }
}

export const fetchWebsitesNotesAction = async (websiteId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const notes = await db.note.findMany({
            where: { websiteId: websiteId, userId: userId, type: 'WEBSITE' }
        })
        return notes;
    } catch (error) {
        console.log("Error fetching website notes:", error);
        throw error;
    }
}

export const addWebsiteNoteAction = async (websiteId: string, title: string, content: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const note = await db.note.create({
            data: {
                websiteId: websiteId,
                title: title,
                content: content,
                type: 'WEBSITE',
                userId: userId,
            }
        })
        return note;
    } catch (error) {
        console.log("Error adding website note:", error);
        throw error;
    }
}

export const updateWebsiteNoteAction = async (noteId: string, title: string, content: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const note = await db.note.update({
            where: { id: noteId, userId: userId, type: 'WEBSITE' },
            data: {
                title: title,
                content: content
            }
        })
        return note;
    } catch (error) {
        console.log("Error updating website note:", error);
        throw error;
    }
}

export const deleteWebsiteNoteAction = async (noteId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const note = await db.note.delete({
            where: { id: noteId, userId: userId, type: 'WEBSITE' }
        })
        return note;
    } catch (error) {
        console.log("Error deleting website note:", error);
        throw error;
    }
}

export const fetchWebsiteMessagesAction = async (websiteId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const messages = await db.website.findUnique({
            where: { id: websiteId, userId: userId },
            select: {
                chatHistory: true
            }
        })
        return messages?.chatHistory || [];
    } catch (error) {
        console.log("Error fetching website messages:", error);
        throw error;
    }
}

export const updateWebsiteMessagesAction = async (websiteId: string, messages: string[]) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const website = await db.website.update({
            where: { id: websiteId, userId: userId },
            data: {
                chatHistory: messages
            }
        })
        return website;
    } catch (error) {
        console.log("Error updating website messages:", error);
        throw error;
    }
}