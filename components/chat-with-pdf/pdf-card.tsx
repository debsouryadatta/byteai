"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pdf } from "@prisma/client";
import { motion } from "framer-motion";
import { FileText, Pencil, Check, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MotionCard = motion(Card);

interface PdfCardProps {
  pdf: Pdf;
  onCardClick: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
}

export function PdfCard({
  pdf,
  onCardClick,
  onDelete,
  onUpdateName,
}: PdfCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(pdf.id);
  };

  const startEditing = (e: React.MouseEvent, currentName: string) => {
    e.stopPropagation();
    setEditingId(pdf.id);
    setEditName(currentName);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      onUpdateName(pdf.id, editName.trim());
      setEditingId(null);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <MotionCard
      className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm transition-all cursor-pointer group hover:scale-105 hover:bg-white/70 dark:hover:bg-gray-900/60"
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 },
        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.2)"
      }}
      onClick={() => onCardClick(pdf.id)}
    >
      <CardHeader className="relative">
        <div className="flex items-start justify-between space-x-4">
          <div className="space-y-1 overflow-hidden">
            {editingId === pdf.id ? (
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 text-lg font-semibold bg-white/50 dark:bg-gray-950/50"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                  onClick={handleSaveEdit}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg font-semibold leading-tight truncate max-w-[180px] sm:max-w-[300px]">
                    {pdf.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 shrink-0"
                    onClick={(e) => startEditing(e, pdf.name ?? "")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs sm:text-sm truncate pr-16">
                  Original: {pdf.originalName}
                </CardDescription>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 shrink-0 h-8 w-8"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Created on: {new Date(pdf.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </CardContent>
    </MotionCard>
  );
}
