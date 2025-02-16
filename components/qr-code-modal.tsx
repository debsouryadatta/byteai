'use client';

import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Url } from '@prisma/client';
import Image from 'next/image';
import { toast } from 'sonner';

interface QRCodeModalProps {
  url: Url;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeModal({ url, open, onOpenChange }: QRCodeModalProps) {
  const handleDownload = async () => {
    try {
      if (!url.qrCodeUrl) {
        toast.error('QR Code not available');
        return;
      }

      const response = await fetch(url.qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `${url.name}-qr-code.png`;
      downloadLink.click();
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
      toast.success('QR Code downloaded successfully!');
    } catch (error) {
      console.error('Error downloading QR Code:', error);
      toast.error('Failed to download QR Code');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code for your shortened URL</DialogTitle>
          <DialogDescription>
            Scan this QR code to visit your shortened URL on your device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 p-4">
          <div id="qr-code" className="bg-white p-4 rounded-lg">
            <Image
              src={url.qrCodeUrl || ''}
              alt="QR Code"
              width={256}
              height={256}
            />
          </div>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}