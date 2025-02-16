'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SummaryModalProps {
  url: string;
  summary: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SummaryModal({ url, summary, open, onOpenChange }: SummaryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI-Generated Content Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden">
          <p className="text-sm text-muted-foreground break-all">
            URL: {url}
          </p>
          <div className="bg-muted/50 p-4 rounded-lg h-[calc(60vh-100px)] overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}