"use client";

import { Button } from "@/components/ui/button";
import { PdfDetailsCard } from "@/components/chat-with-pdf/pdf-details-card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PdfDetailsDialog } from "@/components/chat-with-pdf/pdf-details-dialog";
import { Note, Pdf } from "@prisma/client";
import { addPdfNoteAction, deletePdfNoteAction, fetchPdfByIdAction, fetchPdfNotesAction, updatePdfNoteAction } from "@/actions/chat-with-pdf";
import { useParams } from 'next/navigation'
import LoadingComponent from "@/app/(inner-routes)/loading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function PdfDetailsContent() {
  const params = useParams();
  const pdfId = (params as { pdfId: string }).pdfId;
  
  const router = useRouter();
  const [pdfData, setPdfData] = useState<Pdf | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    name: "",
    content: ""
  });
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const fetchPdfDataAndNotes = async () => {
      try {
        setFetchingData(true);
        const [pdf, notes] = await Promise.all([
          fetchPdfByIdAction(pdfId),
          fetchPdfNotesAction(pdfId)
        ]);
        if (!pdf) {
          router.push("/chat-with-pdf");
          return;
        }
        setPdfData(pdf);
        setNotes(notes);
        console.log("Notes:", notes);
      } catch (error) {
        console.log("Error fetching pdf data and notes:", error);
      } finally {
        setFetchingData(false);
      }
  };
  fetchPdfDataAndNotes();
  }, [pdfId])
  

  const handleCloseNoteDialog = () => {
    setShowNoteDialog(false);
    if (isEditing) {
      setIsEditing(false);
      setSelectedNote(null);
    }
    setNoteForm({ name: "", content: "" });
  };

  const handleEditNote = (note: Note | null) => {
    if (!note) return;
    setIsEditing(true);
    setSelectedNote(note);
    setNoteForm({
      name: note.title!,
      content: note.content!
    });
    setShowNoteDialog(true);
  };

  const handleDeleteNote = (note: Note | null) => {
    if (!note) return;
    setNoteToDelete(note);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      await deletePdfNoteAction(noteToDelete.id);
      setNotes(notes.filter(note => note.id !== noteToDelete.id));
      toast.success("Note deleted successfully!");
      setShowDeleteAlert(false);
      setNoteToDelete(null);
      setSelectedNote(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleNoteSubmit = async () => {
    if (!noteForm.name || !noteForm.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (isEditing && selectedNote) {
        // Update existing note
        const updatedNote = await updatePdfNoteAction(selectedNote.id, noteForm.name, noteForm.content);
        setNotes(notes.map(note => 
          note.id === selectedNote.id ? updatedNote : note
        ));
        toast.success("Note updated successfully!");
      } else {
        // Add new note
        const note = await addPdfNoteAction(pdfId, noteForm.name, noteForm.content);
        setNotes([note, ...notes]);
        toast.success("Note added successfully!");
      }
      handleCloseNoteDialog();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  if (fetchingData) return <LoadingComponent />;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-950 dark:via-black dark:to-cyan-950">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute -top-1/2 -right-1/2 w-[600px] h-[600px] bg-gradient-to-b from-indigo-300/30 to-cyan-300/30 dark:from-indigo-500/20 dark:to-cyan-500/20 blur-3xl rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] bg-gradient-to-t from-blue-300/30 to-purple-300/30 dark:from-blue-500/20 dark:to-purple-500/20 blur-3xl rounded-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b12_1px,transparent_1px),linear-gradient(to_bottom,#64748b12_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative mx-auto px-4 py-12 max-w-5xl space-y-8"
      >
        {/* Header with back button */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/chat-with-pdf")}
            className="hover:bg-white/50 dark:hover:bg-gray-800/50 shrink-0"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent truncate">
            {pdfData?.name}
          </h1>
        </motion.div>

        {/* Main content */}
        {pdfData && (
          <motion.div variants={itemVariants}>
            <PdfDetailsCard
              pdfData={pdfData}
              setShowSummary={setShowSummary}
              setShowNoteDialog={setShowNoteDialog}
              setSelectedNote={setSelectedNote}
              handleEditNote={handleEditNote}
              handleDeleteNote={handleDeleteNote}
              notes={notes}
            />
          </motion.div>
        )}

        {/* Dialogs */}
        <PdfDetailsDialog
          showSummary={showSummary}
          setShowSummary={setShowSummary}
          showNoteDialog={showNoteDialog}
          setShowNoteDialog={setShowNoteDialog}
          showDeleteAlert={showDeleteAlert}
          setShowDeleteAlert={setShowDeleteAlert}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          noteToDelete={noteToDelete}
          setNoteToDelete={setNoteToDelete}
          isEditing={isEditing}
          noteForm={noteForm}
          handleNoteSubmit={handleNoteSubmit}
          handleCloseNoteDialog={handleCloseNoteDialog}
          handleEditNote={handleEditNote}
          handleDeleteNote={handleDeleteNote}
          confirmDelete={confirmDelete}
          setNoteForm={setNoteForm}
          pdfSummary={pdfData?.pdfSummary || ""}
          formatDate={formatDate}
        />
      </motion.div>
    </div>
  );
}
