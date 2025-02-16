"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";

interface PdfDetailsDialogProps {
  showSummary: boolean;
  setShowSummary: (show: boolean) => void;
  showNoteDialog: boolean;
  setShowNoteDialog: (show: boolean) => void;
  showDeleteAlert: boolean;
  setShowDeleteAlert: (show: boolean) => void;
  selectedNote: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  } | null;
  setSelectedNote: (note: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  } | null) => void;
  noteToDelete: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  } | null;
  setNoteToDelete: (note: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  } | null) => void;
  isEditing: boolean;
  noteForm: {
    name: string;
    content: string;
  };
  handleNoteSubmit: () => void;
  handleCloseNoteDialog: () => void;
  handleEditNote: (note: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  }) => void;
  handleDeleteNote: (note: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  }) => void;
  confirmDelete: () => void;
  setNoteForm: (form: { name: string; content: string }) => void;
  pdfSummary: string;
  formatDate: (date: string) => string;
}

export function PdfDetailsDialog({
  showSummary,
  setShowSummary,
  showNoteDialog,
  setShowNoteDialog,
  showDeleteAlert,
  setShowDeleteAlert,
  selectedNote,
  setSelectedNote,
  noteToDelete,
  setNoteToDelete,
  isEditing,
  noteForm,
  handleNoteSubmit,
  handleCloseNoteDialog,
  handleEditNote,
  handleDeleteNote,
  confirmDelete,
  setNoteForm,
  pdfSummary,
  formatDate,
}: PdfDetailsDialogProps) {
  return (
    <>
      {/* PDF Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-4xl h-[90vh] md:h-[85vh] p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl">PDF Summary</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              A comprehensive summary of the PDF content and its key points.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex-1 h-[calc(90vh-10rem)] md:h-[calc(85vh-10rem)]">
            <ScrollArea className="h-full rounded-md border border-border bg-muted/40">
              <div className="p-6 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {pdfSummary}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Form Dialog */}
      <Dialog
        open={showNoteDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseNoteDialog();
          }
          setShowNoteDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Note" : "Add Note"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit your note details below."
                : "Add a new note with title and content."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                value={noteForm.name}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, name: e.target.value })
                }
                placeholder="Enter note title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={noteForm.content}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, content: e.target.value })
                }
                placeholder="Enter note content"
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseNoteDialog}>
              Cancel
            </Button>
            <Button onClick={handleNoteSubmit}>
              {isEditing ? "Update Note" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog
        open={selectedNote !== null && !isEditing}
        onOpenChange={(open) => {
          if (!open && !isEditing) {
            setSelectedNote(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNote?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {selectedNote && formatDate(selectedNote.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[300px] rounded-md border p-4">
            <div className="whitespace-pre-wrap">{selectedNote?.content}</div>
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (selectedNote) {
                  handleEditNote(selectedNote);
                }
              }}
            >
              Edit Note
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedNote) {
                  handleDeleteNote(selectedNote);
                }
              }}
            >
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNoteToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}