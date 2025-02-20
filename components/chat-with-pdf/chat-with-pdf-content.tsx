"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2, Search, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PdfCard } from "./pdf-card";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { createPdfAction, deletePdfAction, fetchPdfsAction, updatePdfNameAction } from "@/actions/chat-with-pdf";
import { Pdf } from "@prisma/client";
import { debounce } from "lodash";
import { useDropzone } from "react-dropzone";
import LoadingComponent from "@/app/(inner-routes)/loading";

const MotionCard = motion(Card);

export function ChatWithPdfContent() {
  const router = useRouter();
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fetchingData, setFetchingData] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only take the last file if multiple files are dropped
    const file = acceptedFiles[acceptedFiles.length - 1];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid PDF file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB max size
    multiple: false
  });

  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  }, []);

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
    const fetchPdfs = async () => {
      try {
        setFetchingData(true);
        const result = await fetchPdfsAction(sortBy, searchQuery);
        setPdfs(result);
      } catch (error) {
        console.log("Error fetching pdfs:", error);
      } finally {
        setFetchingData(false);
      }
    }
    fetchPdfs();
  }, [sortBy, searchQuery])

  const handleCardClick = (id: string) => {
    router.push(`/chat-with-pdf/info/${id}`);
  };

  // Handle PDF deletion
  const handleDeletePdf = async (id: string) => {
    try {
      await deletePdfAction(id);
      setPdfs((prevPdfs) => prevPdfs.filter((pdf) => pdf.id !== id));
      toast.success("PDF deleted successfully");
    } catch (error) {
      console.log("Error deleting pdf:", error);
      toast.error("Error deleting pdf");
    }
  };

  // Handle PDF name update
  const handleUpdatePdfName = async (id: string, newName: string) => {
    try {
      await updatePdfNameAction(id, newName);
      setPdfs((prevPdfs) =>
        prevPdfs.map((pdf) =>
          pdf.id === id ? { ...pdf, name: newName } : pdf
        )
      );
      toast.success("PDF name updated successfully");
    } catch (error) {
      console.log("Error updating pdf name:", error);
      toast.error("Error updating pdf name");
    }
  };

  const createPdf = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile!);
      const pdf = await createPdfAction(formData);
      setPdfs((prevPdfs) => [pdf, ...prevPdfs]);
      setSelectedFile(null);
      toast.success("PDF added to the list");
    } catch (error) {
      console.log("Error creating pdf:", error);
      toast.error("Error creating pdf");
    } finally {
      setIsUploading(false);
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
            Chat with PDF
          </motion.h1>
          <motion.p className="text-sm sm:text-md text-gray-600 dark:text-gray-300">
            Have interactive conversations with your PDF documents using AI
          </motion.p>
        </motion.div>

        {/* PDF Upload Area */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto space-y-3">
          <MotionCard>
            <div
              {...getRootProps()}
              className={`p-3 sm:p-5 border-2 border-dashed ${
                isDragActive 
                  ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20' 
                  : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-950/50'
              } backdrop-blur-sm transition-colors duration-200 cursor-pointer`}
            >
              <input {...getInputProps()} />
              <div className="text-center space-y-2">
                {selectedFile ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-7 w-7 text-gray-400 dark:text-gray-600" />
                    <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      {isDragActive ? "Drop your PDF here" : "Drop Your PDF"}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      or click to select
                    </p>
                  </>
                )}
              </div>
            </div>
          </MotionCard>
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white" 
            disabled={isUploading || !selectedFile}
            onClick={createPdf}
          >
            {isUploading ? "Processing..." : "Submit PDF"}
          </Button>
        </motion.div>

        {/* Search and Sort Section */}
        <motion.div
          variants={itemVariants}
          className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4 z-10" />
            <Input
              className="pl-10 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
              placeholder="Search PDFs..."
              onChange={(e) => debouncedSetSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* PDFs Grid */}
        <motion.div
          variants={itemVariants}
          className="max-w-3xl mx-auto grid grid-cols-1 gap-4"
        >
          {fetchingData && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading sites...
            </div>
          )}
          {!fetchingData && (
            <>
              {pdfs.map((pdf) => (
                <PdfCard
                  key={pdf.id}
                  pdf={pdf}
                  onCardClick={handleCardClick}
                  onDelete={handleDeletePdf}
                  onUpdateName={handleUpdatePdfName}
                />
              ))}
              {pdfs.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No PDFs found. Upload one to get started!
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
