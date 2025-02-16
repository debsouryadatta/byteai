'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Copy, QrCode, Trash2, Sparkles, Book, Pencil, Check, Link2 } from 'lucide-react';
import { QRCodeModal } from './qr-code-modal';
import { SummaryModal } from './summary-modal';
import { Url } from '@prisma/client';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

interface UrlCardProps {
  item: Url;
  onDelete: (id: string) => void;
  onCopy: (shortUrl: string) => Promise<void>;
  onGenerateSummary: (url: Url) => Promise<void>;
  onNameUpdate: (id: string, name: string) => void;
  editingName: string | null;
  newName: string;
  onEditStart: (url: Url) => void;
  onNameChange: (value: string) => void;
  summaryLoading: string | null;
}

export function UrlCard({
  item,
  onDelete,
  onCopy,
  onGenerateSummary,
  onNameUpdate,
  editingName,
  newName,
  onEditStart,
  onNameChange,
  summaryLoading,
}: UrlCardProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleGenerateSummary = async () => {
    await onGenerateSummary(item);
    setShowSummary(true);
  };

  const handleQRCode = () => {
    setShowQRCode(true);
  };

  const copyOriginalUrl = async () => {
    await navigator.clipboard.writeText(item.originalUrl);
  };

  return (
    <>
      <Card className="p-4 sm:p-6 transition-all duration-500 hover:shadow-lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                {item.originalUrl}
              </p>
              {editingName === item.id ? (
                <div className="flex items-center gap-2 max-w-[300px]">
                  <Input
                    value={newName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="text-lg font-medium"
                    autoFocus
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onNameUpdate(item.id, newName)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium truncate">{item.name || item.shortUrl}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditStart(item)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <code className="text-sm font-mono text-muted-foreground break-all">
                {item.shortUrl}
              </code>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap shrink-0">
              {item.summary ? (
                <Button
                  variant="outline"
                  onClick={handleGenerateSummary}
                  className="text-green-600 hover:text-green-700 flex-1 sm:flex-none"
                >
                  <Book className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Summary</span>
                  <span className="sm:hidden">Summary</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading === item.id}
                  className="flex-1 sm:flex-none"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">
                    {summaryLoading === item.id ? 'Generating...' : 'Summarize with AI'}
                  </span>
                  <span className="sm:hidden">
                    {summaryLoading === item.id ? 'Generating...' : 'Summarize'}
                  </span>
                </Button>
              )}
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onCopy(item.originalUrl)}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy original URL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onCopy(item.shortUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy shortened URL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleQRCode}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View QR code</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete URL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground gap-2 sm:gap-0">
            <span>Total clicks: {item.clicks}</span>
            <span>Created: {item.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      <QRCodeModal
        url={item}
        open={showQRCode}
        onOpenChange={setShowQRCode}
      />
      <SummaryModal
        url={item.shortUrl}
        summary={item.summary || ''}
        open={showSummary}
        onOpenChange={setShowSummary}
      />
    </>
  );
}
