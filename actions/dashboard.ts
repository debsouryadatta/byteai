"use server";
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from "@/lib/db";

export const fetchDashboardDataAction = async () => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        
        const data = await db.user.findUnique({
            where: { id: userId },
            select: {
                _count: {
                    select: {
                        websites: true,
                        pdfs: true,
                        ytVideos: true,
                    }
                }
            }
        });
        const dashboardData = {
            websites: data?._count.websites || 0,
            pdfs: data?._count.pdfs || 0,
            ytVideos: data?._count.ytVideos || 0,
        };
        return dashboardData;
    } catch (error) {
        console.log("Error fetching dashboard data:", error);
        throw error;
    }
}