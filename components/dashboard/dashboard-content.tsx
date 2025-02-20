"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchDashboardDataAction } from "@/actions/dashboard";
import { useRouter } from "next/navigation";

const MotionCard = motion(Card);

export function DashboardContent() {
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const [dashboardData, setDashboardData] = useState({
    websites: 0,
    pdfs: 0,
    ytVideos: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await fetchDashboardDataAction();
        console.log("Data: ", data);
        setDashboardData(data);
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-950 dark:via-black dark:to-cyan-950">
      {/* Background decorative elements with animation */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-indigo-300/30 to-cyan-300/30 dark:from-indigo-500/20 dark:to-cyan-500/20 blur-3xl rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-blue-300/30 to-purple-300/30 dark:from-blue-500/20 dark:to-purple-500/20 blur-3xl rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b12_1px,transparent_1px),linear-gradient(to_bottom,#64748b12_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 space-y-4 p-8 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center justify-between space-y-2"
          variants={cardVariants}
        >
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Chat with Site",
              count: dashboardData?.websites,
              description: "Total chats with websites",
              link: "/chat-with-site",
            },
            {
              title: "Chat with PDF",
              count: dashboardData?.pdfs,
              description: "Total PDF conversations",
              link: "/chat-with-pdf",
            },
            {
              title: "Chat with YouTube",
              count: dashboardData?.ytVideos,
              description: "Total YouTube conversations",
              link: "/chat-with-yt",
            },
          ].map((item, index) => (
            <MotionCard
              key={index}
              className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm transition-colors hover:bg-white/60 dark:hover:bg-gray-900/60 cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              initial="hidden"
              animate="visible"
              onClick={() => router.push(item.link)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <motion.div variants={statsVariants}>
                  <div className="text-2xl font-bold">{item.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
