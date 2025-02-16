"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { WebsiteCard } from "./website-card";
import { useState, useMemo } from "react";

const MotionCard = motion(Card);

// Format date consistently
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

// Demo data
const initialSites = [
  {
    id: 1,
    name: "My Portfolio",
    url: "https://portfolio.com",
    createdAt: "2024-02-15T12:00:00Z",
  },
  {
    id: 2,
    name: "Tech Blog",
    url: "https://techblog.com",
    createdAt: "2024-02-14T15:30:00Z",
  },
];

export function ChatWithSiteContent() {
  const router = useRouter();
  const [sites, setSites] = useState(initialSites);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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

  const handleCardClick = (id: number) => {
    router.push(`/chat-with-site/info/${id}`);
  };

  // Handle site deletion
  const handleDeleteSite = (id: number) => {
    setSites((prevSites) => prevSites.filter((site) => site.id !== id));
  };

  // Handle site name update
  const handleUpdateSiteName = (id: number, newName: string) => {
    setSites((prevSites) =>
      prevSites.map((site) =>
        site.id === id ? { ...site, name: newName } : site
      )
    );
  };

  // Filter and sort sites
  const filteredAndSortedSites = useMemo(() => {
    let result = [...sites];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.url.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [sites, searchQuery, sortBy]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-950 dark:via-black dark:to-cyan-950">
      {/* Background decorative elements */}
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
        className="relative z-10 container mx-auto px-4 py-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2 my-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent"
          >
            Chat with Website
          </motion.h1>
          <motion.p className="text-sm sm:text-md text-gray-600 dark:text-gray-300">
            Interact with your favorite websites using AI-powered conversations
          </motion.p>
        </motion.div>

        {/* URL Input Section */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter the website link"
              className="flex-1 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
            />
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
              Submit
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          variants={itemVariants}
          className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4 z-10" />
            <div className="relative">
              <Input
                placeholder="Search sites..."
                className="pl-10 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Sites List */}
        <motion.div
          variants={itemVariants}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            List of Sites
          </h2>
          {filteredAndSortedSites.map((site) => (
            <WebsiteCard
              key={site.id}
              site={site}
              onCardClick={handleCardClick}
              formatDate={formatDate}
              onDelete={handleDeleteSite}
              onUpdateName={handleUpdateSiteName}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
