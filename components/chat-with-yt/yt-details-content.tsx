"use client";

import { Button } from "@/components/ui/button";
import { YtDetailsCard } from "@/components/chat-with-yt/yt-details-card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { YtDetailsDialog } from "@/components/chat-with-yt/yt-details-dialog";

// Demo data
const videoData = {
  name: "Complete React Tutorial",
  url: "https://youtube.com/watch?v=abc123",
  createdAt: "2024-02-16T12:00:00Z",
  summary: `This comprehensive React tutorial covers all essential concepts and best practices. The video provides a detailed walkthrough of building modern web applications with React.

Key Topics Covered:
1. React fundamentals and hooks
2. State management techniques
3. Component lifecycle methods
4. Performance optimization
5. Testing and debugging

Technical Stack:
- React 18
- TypeScript
- Redux Toolkit
- React Router
- Jest & React Testing Library

Performance Metrics:
• Video Length: 2.5 hours
• Quality: 1080p HD
• Chapters: 12
• Exercise Files: Included

Course Structure:
• Introduction
  - React ecosystem overview
  - Development environment setup
• Core Concepts
  - Components and JSX
  - Props and state
  - Hooks deep dive
• Advanced Topics
  - Custom hooks
  - Context API
  - Performance optimization
• Project Implementation
  - Real-world application
  - Best practices

Recommendations:
1. Follow along with code examples
2. Complete practice exercises
3. Join Discord community
4. Review chapter quizzes
5. Build portfolio project`,
  notes: [
    { 
      id: 1, 
      name: "React Hooks Overview", 
      content: `Comprehensive overview of React Hooks and their practical applications:

1. useState
- State management basics
- Complex state patterns
- State updates and batching
- Performance considerations

2. useEffect
- Side effects management
- Dependency array optimization
- Cleanup functions
- Common pitfalls

3. useContext
- Global state management
- Context providers
- Performance implications
- Best practices

4. useRef
- DOM references
- Mutable values
- Previous value pattern
- Integration with forms

5. useMemo & useCallback
- Performance optimization
- Memoization strategies
- When to use
- Common use cases

Implementation Tips:
- Always define dependencies correctly
- Use ESLint hooks plugin
- Consider custom hooks for reusability
- Test hooks in isolation

Advanced Patterns:
1. Custom hooks composition
2. Hooks with TypeScript
3. Error boundaries
4. Suspense integration

Best Practices:
- Keep hooks at top level
- Use meaningful names
- Document complex logic
- Handle edge cases`, 
      createdAt: "2024-02-16T10:00:00Z" 
    },
    { 
      id: 2, 
      name: "Performance Optimization", 
      content: `Key performance optimization techniques covered in the video:

1. Component Optimization
- React.memo usage
- Pure components
- Lazy loading
- Code splitting

2. State Management
- Local vs global state
- State colocation
- Normalized state shape
- Immutable updates

3. Rendering Optimization
- Virtual DOM understanding
- Key prop usage
- List rendering
- Conditional rendering

4. Network Optimization
- Data fetching strategies
- Caching implementation
- Prefetching data
- Error handling

5. Bundle Optimization
- Tree shaking
- Dynamic imports
- Module splitting
- Asset optimization

6. Development Tools
- React DevTools
- Performance profiler
- Bundle analyzer
- Lighthouse metrics

Action Items:
1. Implement code splitting
2. Optimize image loading
3. Add error boundaries
4. Set up performance monitoring
5. Review bundle size`, 
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

export default function YtDetailsContent() {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedNote, setSelectedNote] = useState<(typeof videoData.notes)[0] | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<(typeof videoData.notes)[0] | null>(null);
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

  const handleNoteSubmit = () => {
    if (!noteForm.name || !noteForm.content) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isEditing && selectedNote) {
      // Update existing note
      videoData.notes = videoData.notes.map(note => 
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
      videoData.notes.unshift(newNote);
      toast.success("Note added successfully!");
    }

    handleCloseNoteDialog();
  };

  const handleEditNote = (note: (typeof videoData.notes)[0] | null) => {
    if (!note) return;
    setIsEditing(true);
    setSelectedNote(note);
    setNoteForm({
      name: note.name,
      content: note.content
    });
    setShowNoteDialog(true);
  };

  const handleDeleteNote = (note: (typeof videoData.notes)[0] | null) => {
    if (!note) return;
    setNoteToDelete(note);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      videoData.notes = videoData.notes.filter(note => note.id !== noteToDelete.id);
      toast.success("Note deleted successfully!");
      setShowDeleteAlert(false);
      setNoteToDelete(null);
      setSelectedNote(null);
    }
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
            {videoData.name}
          </h1>
        </motion.div>

        {/* Video Details Card with Notes */}
        <motion.div variants={itemVariants}>
          <YtDetailsCard 
            videoData={videoData}
            setShowSummary={setShowSummary}
            setShowNoteDialog={setShowNoteDialog}
            setSelectedNote={setSelectedNote}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
            formatDate={formatDate}
          />
        </motion.div>
      </motion.div>

      <YtDetailsDialog 
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
        videoSummary={videoData.summary}
        formatDate={formatDate}
      />
    </div>
  );
}
