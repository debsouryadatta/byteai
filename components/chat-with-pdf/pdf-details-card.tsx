"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ExternalLink, FileText, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PdfData {
  name: string;
  url: string;
  createdAt: string;
  summary: string;
  notes: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  }[];
}

interface PdfDetailsCardProps {
  pdfData: PdfData;
  setShowSummary: (show: boolean) => void;
  setShowNoteDialog: (show: boolean) => void;
  setSelectedNote: (note: PdfData["notes"][0] | null) => void;
  handleEditNote: (note: PdfData["notes"][0]) => void;
  handleDeleteNote: (note: PdfData["notes"][0]) => void;
  formatDate: (date: string) => string;
}

export function PdfDetailsCard({
  pdfData,
  setShowSummary,
  setShowNoteDialog,
  setSelectedNote,
  handleEditNote,
  handleDeleteNote,
  formatDate,
}: PdfDetailsCardProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* PDF Info Card */}
      <Card className="p-8 bg-white/50 dark:bg-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 group">
              <ExternalLink className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
              <a
                href={pdfData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300 text-lg"
              >
                {pdfData.url}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">Created on {formatDate(pdfData.createdAt)}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={() => router.push(`/chat-with-pdf/chat-room/${1}`)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Start Chat
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSummary(true)}
              className="border-gray-200 dark:border-gray-800 hover:border-primary/50 shadow-md hover:shadow-lg transition-all duration-300 px-6"
            >
              <FileText className="h-5 w-5 mr-2" />
              PDF Summary
            </Button>
          </div>
        </div>
      </Card>

      {/* Notes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
            Added Notes
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowNoteDialog(true)}
            className="border-gray-200 dark:border-gray-800 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Notes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {pdfData.notes.map((note) => (
              <Card
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/50 dark:bg-gray-950/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm group hover:bg-white/70 dark:hover:bg-gray-900/60"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
                      {note.name}
                    </h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note);
                        }}
                        className="hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              </Card>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}