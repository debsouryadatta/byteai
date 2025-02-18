-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "type" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PdfContentEmbedding" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pdfId" TEXT NOT NULL,

    CONSTRAINT "PdfContentEmbedding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PdfContentEmbedding" ADD CONSTRAINT "PdfContentEmbedding_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf"("id") ON DELETE CASCADE ON UPDATE CASCADE;
