"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { PdfDetailsDialog } from "@/components/chat-with-pdf/pdf-details-dialog";
import { PdfDetailsCard } from "@/components/chat-with-pdf/pdf-details-card";

// Demo data
const pdfData = {
  name: "Research Paper",
  url: "https://example.com/research-paper.pdf",
  createdAt: "2024-02-16T12:00:00Z",
  summary: `Title: Advanced Machine Learning Techniques in Natural Language Processing

Abstract:
This research paper explores cutting-edge machine learning techniques applied to natural language processing tasks. We present a comprehensive analysis of recent developments in transformer architectures, attention mechanisms, and their applications in various NLP domains.

Key Findings:
1. Transformer Architecture Improvements
   - Enhanced attention mechanisms
   - Optimized positional encoding
   - Reduced computational complexity

2. Performance Metrics
   - BLEU Score: 45.6
   - ROUGE-L: 38.9
   - Perplexity: 3.2

3. Application Areas
   - Machine Translation
   - Text Summarization
   - Question Answering
   - Sentiment Analysis

Methodology:
• Data Collection
  - Corpus size: 1M sentences
  - Languages: 10
  - Domains: 5

• Model Architecture
  - Attention layers: 12
  - Hidden size: 768
  - Feed-forward size: 3072

• Training Details
  - Batch size: 32
  - Learning rate: 1e-4
  - Epochs: 100

Results Discussion:
1. Improved accuracy across all tasks
2. Reduced training time by 40%
3. Lower memory footprint
4. Better generalization

Future Directions:
- Explore sparse attention mechanisms
- Investigate multilingual capabilities
- Optimize for edge devices
- Enhance few-shot learning

Conclusions:
Our proposed improvements demonstrate significant advances in NLP tasks while maintaining computational efficiency. The results suggest promising directions for future research in the field.`,
  notes: [
    {
      id: 1,
      name: "Key Findings Analysis",
      content: `Important observations from the key findings section:

1. Transformer Architecture
- Notable improvements in attention mechanism efficiency
- Innovative approach to positional encoding
- Significant reduction in computational requirements
- Potential for scaling to larger models

2. Performance Metrics
- BLEU score shows competitive results
- ROUGE-L indicates good summary quality
- Low perplexity suggests strong language modeling

3. Implementation Considerations
- Architecture choices well-justified
- Training parameters carefully selected
- Results reproducible across different datasets

4. Future Applications
- Promising for industrial applications
- Scalability looks feasible
- Cost-effective for production deployment

Follow-up Actions:
1. Implement baseline model
2. Compare with existing solutions
3. Evaluate on custom datasets
4. Document performance metrics`,
      createdAt: "2024-02-16T10:00:00Z"
    },
    {
      id: 2,
      name: "Implementation Notes",
      content: `Technical implementation details to consider:

1. Model Architecture
- 12 attention layers optimal for our use case
- 768 hidden size balances performance and efficiency
- 3072 feed-forward size provides good capacity

2. Training Configuration
- Batch size of 32 works well with available GPU memory
- Learning rate of 1e-4 shows stable convergence
- 100 epochs sufficient for convergence

3. Resource Requirements
- GPU: NVIDIA A100 or similar
- Memory: 32GB minimum
- Storage: 500GB for dataset and checkpoints

4. Optimization Strategies
- Gradient accumulation for larger effective batch sizes
- Mixed precision training
- Gradient checkpointing for memory efficiency

5. Monitoring Setup
- TensorBoard for training metrics
- WandB for experiment tracking
- Custom logging for system metrics

Next Steps:
1. Set up development environment
2. Prepare data pipeline
3. Implement training loop
4. Set up monitoring tools`,
      createdAt: "2024-02-15T14:30:00Z"
    },
  ]
};

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
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedNote, setSelectedNote] = useState<(typeof pdfData.notes)[0] | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<(typeof pdfData.notes)[0] | null>(null);
  const [noteForm, setNoteForm] = useState({
    name: "",
    content: ""
  });

  const handleCloseNoteDialog = () => {
    setShowNoteDialog(false);
    if (isEditing) {
      setIsEditing(false);
      setSelectedNote(null);
    }
    setNoteForm({ name: "", content: "" });
  };

  const handleEditNote = (note: typeof selectedNote) => {
    if (!note) return;
    setIsEditing(true);
    setSelectedNote(note);
    setNoteForm({
      name: note.name,
      content: note.content
    });
    setShowNoteDialog(true);
  };

  const handleDeleteNote = (note: typeof selectedNote) => {
    if (!note) return;
    setNoteToDelete(note);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (!noteToDelete) return;
    
    pdfData.notes = pdfData.notes.filter(note => note.id !== noteToDelete.id);
    toast.success("Note deleted successfully!");
    setShowDeleteAlert(false);
    setNoteToDelete(null);
    setSelectedNote(null);
  };

  const handleNoteSubmit = () => {
    if (!noteForm.name || !noteForm.content) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isEditing && selectedNote) {
      // Update existing note
      pdfData.notes = pdfData.notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, name: noteForm.name, content: noteForm.content }
          : note
      );
      toast.success("Note updated successfully!");
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        name: noteForm.name,
        content: noteForm.content,
        createdAt: new Date().toISOString()
      };
      pdfData.notes.unshift(newNote);
      toast.success("Note added successfully!");
    }

    handleCloseNoteDialog();
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

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
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-secondary/80 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
            {pdfData.name}
          </h1>
        </motion.div>

        {/* PDF Details Card with Notes */}
        <motion.div variants={itemVariants}>
          <PdfDetailsCard 
            pdfData={pdfData}
            setShowSummary={setShowSummary}
            setShowNoteDialog={setShowNoteDialog}
            setSelectedNote={setSelectedNote}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
            formatDate={formatDate}
          />
        </motion.div>
      </motion.div>

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
        pdfSummary={pdfData.summary}
        formatDate={formatDate}
      />
    </div>
  );
}
