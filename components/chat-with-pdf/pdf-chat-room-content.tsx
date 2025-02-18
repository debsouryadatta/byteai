"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { useChat } from '@ai-sdk/react';
import { useParams } from 'next/navigation'
import { fetchPdfMessagesAction, updatePdfMessagesAction } from "@/actions/chat-with-pdf";
import { toast } from "sonner";
import { generateId } from "ai";

export default function PdfChatRoomContent() {
  const params = useParams();
  const pdfId = (params as { pdfId: string }).pdfId;
  const [messagesFromDb, setMessagesFromDb] = useState<any[]>([]);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        role: "assistant",
        content: "Hello! I'm ready to help you explore and understand the PDF content. What would you like to know?",
        id: "1",
      },
      ...(messagesFromDb.length > 0 ? messagesFromDb : []),
    ],
    api: "/api/chat/pdf",
    body: {
      pdfId: pdfId,
    },
    onFinish: async (message, options) => {
      try {
        const inputMessage = { id: generateId(), role: "user", content: input };
        const aiMessage = { id: message.id, role: "assistant", content: message.content }
        await updatePdfMessagesAction(pdfId, [...messagesFromDb, inputMessage, aiMessage]);
        setMessagesFromDb([...messagesFromDb, inputMessage, aiMessage]); 
      } catch (error) {
        console.log("Error updating pdf messages:", error);
        toast.error("Error updating pdf messages");
      }
    },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchPdfMessages = async () => {
     try {
        const messages = await fetchPdfMessagesAction(pdfId);
        setMessagesFromDb(messages);
     } catch (error) {
        console.log("Error fetching pdf messages:", error);
     } 
    }
    fetchPdfMessages();
  }, [pdfId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hasMessage = input.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && hasMessage) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-950 dark:via-black dark:to-cyan-950">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Background decorative elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-indigo-300/30 to-cyan-300/30 dark:from-indigo-500/20 dark:to-cyan-500/20 blur-3xl rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-blue-300/30 to-purple-300/30 dark:from-blue-500/20 dark:to-purple-500/20 blur-3xl rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      
      <div className="flex-1 flex flex-col container max-w-4xl mx-auto p-4">
        {/* Header */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/chat-with-pdf/info/${pdfId}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chat with PDF</h1>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Messages Container */}
          <motion.div
            className="flex-1 space-y-4 overflow-y-auto hide-scrollbar pr-2 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    "flex items-start",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "p-1 rounded-full shrink-0",
                    msg.role === "assistant" ? "bg-primary/10" : "bg-muted ml-2"
                  )}>
                    {msg.role === "assistant" ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.1 }}
                    className={cn(
                      "ml-2 flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <Card 
                      className={cn(
                        "p-3 inline-block bg-background/50 backdrop-blur-sm",
                        msg.role === "user" ? "bg-primary/10" : ""
                      )}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Thinking Animation */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed bottom-24 left-0 right-0 flex justify-center"
              >
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm">
                  <div className="w-4 h-4 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm font-medium">Thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <motion.div
            className="mt-4 border-t bg-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="p-2 backdrop-blur-sm bg-background/50 border-muted shadow-lg">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground/50"
                />
                <Button 
                  type="submit"
                  size="icon" 
                  disabled={!hasMessage}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    hasMessage 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25" 
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Send className={cn(
                    "h-4 w-4 transition-transform",
                    hasMessage && "translate-x-0.5"
                  )} />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
