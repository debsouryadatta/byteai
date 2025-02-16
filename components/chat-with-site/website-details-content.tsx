"use client";

import { Button } from "@/components/ui/button";
import { WebsiteDetailsCard } from "@/components/chat-with-site/website-details-card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { WebsiteDetailsDialog } from "@/components/chat-with-site/website-details-dialog";

// Demo data
const websiteData = {
  name: "My Tech Blog",
  url: "https://techblog.com",
  createdAt: "2024-02-16T12:00:00Z",
  summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Key Points:
1. Responsive design implementation
2. SEO optimization techniques
3. Performance metrics and improvements
4. Content strategy analysis
5. User engagement patterns

Technical Stack:
- Next.js for frontend
- Node.js backend
- MongoDB database
- AWS hosting

Performance Metrics:
• Page Load Time: 2.3s
• First Contentful Paint: 0.8s
• Time to Interactive: 3.1s
• Cumulative Layout Shift: 0.1

SEO Analysis:
- Meta tags properly implemented
- XML sitemap present
- robots.txt configured
- Mobile-friendly design
- SSL certificate installed

Content Structure:
• Homepage
  - Hero section
  - Featured articles
  - Newsletter signup
• Blog Section
  - Category filters
  - Search functionality
  - Pagination
• About Page
• Contact Form

Recommendations:
1. Implement image lazy loading
2. Add service worker for offline access
3. Optimize database queries
4. Implement content caching
5. Add social sharing buttons`,
  notes: [
    { 
      id: 1, 
      name: "Homepage Analysis", 
      content: `The homepage demonstrates a well-structured layout with clear hierarchy and intuitive navigation. Key observations include:

1. Above the Fold
- Hero section effectively communicates value proposition
- Clear call-to-action buttons with good contrast
- Responsive design adapts well to different screen sizes

2. Content Organization
- Featured articles section showcases latest content
- Clear categorization of blog posts
- Search functionality is prominently placed
- Newsletter signup form is strategically positioned

3. Performance Considerations
- Images are properly optimized
- Lazy loading implemented for below-fold content
- Caching strategies in place
- First contentful paint under 1 second

4. User Experience
- Navigation menu is intuitive
- Mobile-friendly interface
- Clear typography hierarchy
- Consistent color scheme

5. Technical Implementation
- Built with Next.js for optimal performance
- Server-side rendering for critical content
- Progressive web app capabilities
- Proper meta tags for SEO

Areas for Improvement:
- Consider adding a sticky navigation bar
- Implement skeleton loading states
- Add more interactive elements
- Optimize for Core Web Vitals`, 
      createdAt: "2024-02-16T10:00:00Z" 
    },
    { 
      id: 2, 
      name: "SEO Improvements", 
      content: `Comprehensive SEO analysis reveals several opportunities for optimization:

1. Technical SEO
- Implement XML sitemap with priority settings
- Optimize robots.txt configuration
- Add schema markup for rich snippets
- Improve page load speed

2. On-Page SEO
- Optimize meta titles and descriptions
- Implement proper header hierarchy
- Add alt text to all images
- Optimize URL structure

3. Content Strategy
- Develop keyword-focused content plan
- Create pillar pages for main topics
- Implement internal linking strategy
- Regular content updates

4. Mobile Optimization
- Ensure mobile-first indexing readiness
- Optimize touch targets
- Improve mobile page speed
- Implement AMP for key pages

5. User Experience Signals
- Reduce bounce rate through engagement
- Increase time on page
- Improve site structure
- Enhance readability

6. Local SEO
- Optimize Google My Business
- Create location-specific pages
- Implement local schema markup
- Build local citations

Action Items:
1. Update meta tags across all pages
2. Implement comprehensive schema markup
3. Optimize image delivery and compression
4. Create content calendar for regular updates
5. Monitor Core Web Vitals`, 
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

export default function WebsiteDetailsContent() {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedNote, setSelectedNote] = useState<(typeof websiteData.notes)[0] | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<(typeof websiteData.notes)[0] | null>(null);
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
    
    websiteData.notes = websiteData.notes.filter(note => note.id !== noteToDelete.id);
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
      websiteData.notes = websiteData.notes.map(note => 
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
      websiteData.notes.unshift(newNote);
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
            {websiteData.name}
          </h1>
        </motion.div>

        {/* Website Details Card with Notes */}
        <motion.div variants={itemVariants}>
          <WebsiteDetailsCard 
            websiteData={websiteData}
            setShowSummary={setShowSummary}
            setShowNoteDialog={setShowNoteDialog}
            setSelectedNote={setSelectedNote}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
            formatDate={formatDate}
          />
        </motion.div>
      </motion.div>

      <WebsiteDetailsDialog 
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
        websiteSummary={websiteData.summary}
        formatDate={formatDate}
      />
    </div>
  );
}
