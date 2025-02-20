"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { WebsiteCard } from "./website-card";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { createWebsiteAction, deleteWebsiteAction, fetchWebsitesAction, updateWebsiteNameAction } from "@/actions/chat-with-site";
import { Website } from "@prisma/client";
import { debounce } from "lodash";
import LoadingComponent from "@/app/(inner-routes)/loading";

// Format date consistently
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

export function ChatWithSiteContent() {
  const router = useRouter();
  const [sites, setSites] = useState<Website[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [url, setUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

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

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setFetchingData(true);
        const result = await fetchWebsitesAction(sortBy, searchQuery);
        setSites(result); 
      } catch (error) {
        console.log("Error fetching sites:", error);
      } finally {
        setFetchingData(false);
      }
    }
    fetchSites();
  }, [sortBy, searchQuery])

  const handleCardClick = (id: string) => {
    router.push(`/chat-with-site/info/${id}`);
  };

  // Handle site deletion
  const handleDeleteSite = async (id: string) => {
    try {
      await deleteWebsiteAction(id);
      setSites((prevSites) => prevSites.filter((site) => site.id !== id));
      toast.success("Site deleted successfully");
    } catch (error) {
      console.log("Error deleting site:", error);
      toast.error("Error deleting site");
    }
  };

  // Handle site name update
  const handleUpdateSiteName = async (id: string, newName: string) => {
    try {
      await updateWebsiteNameAction(id, newName);
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === id ? { ...site, name: newName } : site
        )
      );
      toast.success("Site name updated successfully");
    } catch (error) {
      console.log("Error updating site name:", error);
      toast.error("Error updating site name");
    }
  };

  const createWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const website = await createWebsiteAction(url);
      console.log("Website created:", website);
      setSites((prevSites) => [website, ...prevSites]);
      toast.success("Site added to the list");
      setUrl("");
    } catch (error) {
      console.log("Error creating website:", error);
      toast.error("Error creating website");
    } finally {
      setIsCreating(false);
    }
  }

  // Create debounced search handler
  const debouncedSetSearchQuery = useMemo(
    () => debounce((value: string) => setSearchQuery(value), 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [debouncedSetSearchQuery]);

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
          <form onSubmit={createWebsite} className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter the website link"
              className="flex-1 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
            <Button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white" disabled={isCreating}>
              { isCreating ? "Submitting..." : "Submit" }
            </Button>
          </form>
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
                defaultValue={searchQuery}
                onChange={(e) => debouncedSetSearchQuery(e.target.value)}
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
          {fetchingData && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading sites...
            </div>
          )}
          {!fetchingData && (
            <>
              {sites.map((site) => (
                <WebsiteCard
                  key={site.id}
                  site={site}
                  onCardClick={handleCardClick}
                  onDelete={handleDeleteSite}
                  onUpdateName={handleUpdateSiteName}
                />
              ))}
              {sites.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No sites found. Upload one to get started!
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
