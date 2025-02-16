"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ExternalLink, Pencil, Check, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MotionCard = motion(Card);

interface Video {
  id: number;
  name: string;
  url: string;
  createdAt: string;
}

interface YtCardProps {
  video: Video;
  onCardClick: (id: number) => void;
  formatDate: (date: string) => string;
  onDelete: (id: number) => void;
  onUpdateName: (id: number, newName: string) => void;
}

export function YtCard({ video, onCardClick, formatDate, onDelete, onUpdateName }: YtCardProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(video.id);
    toast.success("Video deleted successfully");
  };

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const startEditing = (e: React.MouseEvent, currentName: string) => {
    e.stopPropagation();
    setEditingId(video.id);
    setEditName(currentName);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      onUpdateName(video.id, editName.trim());
      toast.success("Video name updated successfully");
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
      onClick={() => onCardClick(video.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="space-y-1 flex-1">
          {editingId === video.id ? (
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
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{video.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500"
                onClick={(e) => startEditing(e, video.name)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            {video.url}
            <ExternalLink 
              className="h-4 w-4 inline cursor-pointer"
              onClick={(e) => handleExternalLink(e, video.url)}
            />
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Created at: {formatDate(video.createdAt)}
        </p>
      </CardContent>
    </MotionCard>
  );
}
