"use server";

import { getPdfUrl } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { generatePdfSummary } from "@/lib/openai";
import { generatePdfChunkEmbeddings } from "@/lib/rag";
import { auth } from '@clerk/nextjs/server'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const fetchPdfsAction = async (sortBy: string = 'newest', searchQuery: string = '') => {
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

        const pdfs = await db.pdf.findMany({
            where: {
                userId,
                ...(searchQuery.length > 0 ? {
                    OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { originalName: { contains: searchQuery, mode: 'insensitive' } }
                    ]
                } : {})
            },
            orderBy
        });
        
        return pdfs;
    } catch (error) {
        console.log("Error fetching pdfs:", error);
        throw error;
    }
}

export const createPdfAction = async (formData: FormData) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const pdfFile = formData.get("file") as File;        
        const arrayBuffer = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfUrl = await getPdfUrl(buffer);

        // Create a new PDFLoader instance
        const loader = new PDFLoader(pdfFile, {
            splitPages: false // Set to false to get all text in a single document
        });
        // Load and extract the text
        const docs = await loader.load();
        const pdfContent = docs[0].pageContent;
        const pdfSummary = await generatePdfSummary(pdfContent);

        const pdf = await db.pdf.create({
            data: {
                name: pdfFile.name,
                originalName: pdfFile.name,
                pdfUrl: pdfUrl,
                pdfContent: pdfContent,
                pdfSummary: pdfSummary,
                userId: userId,
            }
        })


        // Split the pdfContent into chunks and store in pgvector
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments([docs[0]]);
        const pureChunks = chunks.map((chunk) => chunk.pageContent);

        const allEmbeddings = await generatePdfChunkEmbeddings(pureChunks)
        console.log("Embeddings:", allEmbeddings);

        await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
            console.log(`processing ${index} of ${allEmbeddings.length}`);

            if (!embedding) return

            console.log("inserting ...");

            const pdfContentEmbedding = await db.pdfContentEmbedding.create({
                data: {
                    content: pureChunks[index],
                    pdfId: pdf.id,
                }
            })
            await db.$executeRaw`
            UPDATE "PdfContentEmbedding" 
            SET "embedding" = ${embedding}::vector
            WHERE "id" = ${pdfContentEmbedding.id}; 
        `

            console.log("inserted !");
        }))

        return pdf;
    } catch (error) {
        console.log("Error creating pdf:", error);
        throw error;
    }
}

export const deletePdfAction = async (pdfId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const pdf = await db.pdf.delete({
            where: { id: pdfId, userId: userId }
        })
        return pdf;
    } catch (error) {
        console.log("Error deleting pdf:", error);
        throw error;
    }
}

export const updatePdfNameAction = async (pdfId: string, name: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const pdf = await db.pdf.update({
            where: { id: pdfId, userId: userId },
            data: { name: name }
        })
        return pdf;
    } catch (error) {
        console.log("Error updating pdf name:", error);
        throw error;
    }
}

export const fetchPdfByIdAction = async (pdfId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const pdf = await db.pdf.findUnique({
            where: { id: pdfId, userId: userId }
        })
        return pdf;
    } catch (error) {
        console.log("Error fetching pdf:", error);
        throw error;
    }
}

export const fetchPdfNotesAction = async (pdfId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const notes = await db.note.findMany({
            where: { pdfId: pdfId, userId: userId, type: 'PDF' }
        })
        return notes;
    } catch (error) {
        console.log("Error fetching pdf notes:", error);
        throw error;
    }
}

export const addPdfNoteAction = async (pdfId: string, title: string, content: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const note = await db.note.create({
            data: {
                pdfId: pdfId,
                title: title,
                content: content,
                type: 'PDF',
                userId: userId,
            }
        })
        return note;
    } catch (error) {
        console.log("Error adding pdf note:", error);
        throw error;
    }
}

export const updatePdfNoteAction = async (noteId: string, title: string, content: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const note = await db.note.update({
            where: { id: noteId, userId: userId, type: 'PDF' },
            data: {
                title: title,
                content: content
            }
        })
        return note;
    } catch (error) {
        console.log("Error updating pdf note:", error);
        throw error;
    }
}

export const deletePdfNoteAction = async (noteId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const note = await db.note.delete({
            where: { id: noteId, userId: userId, type: 'PDF' }
        })
        return note;
    } catch (error) {
        console.log("Error deleting pdf note:", error);
        throw error;
    }
}

export const fetchPdfMessagesAction = async (pdfId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const messages = await db.pdf.findUnique({
            where: { id: pdfId, userId: userId },
            select: {
                chatHistory: true
            }
        })
        return messages?.chatHistory || [];
    } catch (error) {
        console.log("Error fetching pdf messages:", error);
        throw error;
    }
}

export const updatePdfMessagesAction = async (pdfId: string, messages: string[]) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const pdf = await db.pdf.update({
            where: { id: pdfId, userId: userId },
            data: {
                chatHistory: messages
            }
        })
        return pdf;
    } catch (error) {
        console.log("Error updating pdf messages:", error);
        throw error;
    }
}