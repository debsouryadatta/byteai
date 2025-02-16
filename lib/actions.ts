"use server";

import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs/server'
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { getPhotoUrl } from "./cloudinary";
import { generateName, generateSummary } from "./openai";

export const fetchUserShortenedUrlsAction = async () => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const shortenedUrls = await db.url.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return shortenedUrls;
    } catch (error) {
        console.log("Error fetching user shortened URLs:", error);
        throw error;
    }
}

export const createShortUrlAction = async (originalUrl: string, useAiName: boolean) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        let name: string | null = null;
        if (useAiName) {
            let pageContent: any = await fetch(`${process.env.CRAWL4AI_BE_URL}/crawl?url=${originalUrl}`)
            pageContent = await pageContent.json()
            name = await generateName(pageContent.markdown)
        }
        const shortCode = nanoid(8);
        const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;
        const qrCode = await QRCode.toDataURL(shortUrl);
        const qrCodeUrl = await getPhotoUrl(qrCode);
        console.log("QR Code URL:", qrCodeUrl);
        const newUrl = await db.url.create({
            data: {
                originalUrl: originalUrl,
                shortUrl: shortUrl,
                shortCode: shortCode,
                name: name || shortUrl,
                userId: userId,
                qrCodeUrl: qrCodeUrl
            }
        })
        return newUrl;
    } catch (error) {
        console.log("Error creating short URL:", error);
        throw error;
    }
}

export const deleteShortUrlAction = async (id: string) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const url = await db.url.findUnique({
            where: { id: id }
        })
        if (!url) {
            throw new Error('URL not found');
        }
        await db.url.delete({
            where: { id: id }
        })
        return url;
    } catch (error) {
        console.log("Error deleting short URL:", error);
        throw error;
    }
}

export const updateUrlAction = async (id: string, data: any) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const url = await db.url.update({
            where: { id: id },
            data: data
        })
        return url;
    } catch (error) {
        console.log("Error updating short URL:", error);
        throw error;
    }
}

export const createPageContentAndSummaryAction = async (originalUrl: string, id: string) => {
    try {
      let pageContent: any = await fetch(`${process.env.CRAWL4AI_BE_URL}/crawl?url=${originalUrl}`)
      pageContent = await pageContent.json()
      const summary = await generateSummary(pageContent.markdown)
      await db.url.update({
        where: { id: id },
        data: {
          summary: summary,
          pageContent: pageContent.markdown
        }
      })
      return { summary, pageContent };
    } catch (error) {
        console.log("Error creating page content and summary:", error);
        throw error;
    }
}