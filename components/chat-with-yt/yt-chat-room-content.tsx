"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "assistant" | "user";
  content: string;
  id: string;
};

const demoMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm ready to help you explore and understand the video content. What would you like to know?",
    id: "1",
  },
  {
    role: "user",
    content: "What are the main topics covered in this video?",
    id: "2",
  },
  {
    role: "assistant",
    content: "This video covers several key topics:\n\n1. Introduction to the subject\n2. Key concepts and principles\n3. Practical examples and demonstrations\n4. Common questions and solutions\n\nWould you like me to explain any of these topics in more detail?",
    id: "3",
  },
];

export default function YtChatRoomContent() {
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [message, setMessage] = useState("");
  const hasMessage = message.trim().length > 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (!hasMessage) return;

    const newMessage: Message = {
      role: "user",
      content: message.trim(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "I understand your message. This is a simulated response. In the actual implementation, this will be replaced with the real AI response.",
        id: (Date.now() + 1).toString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && hasMessage) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-950 dark:via-black dark:to-cyan-950">
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
      
      <div className="container max-w-4xl mx-auto p-4 relative">
        {/* Header */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/chat-with-yt/info/${1}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chat with YouTube</h1>
        </motion.div>

        {/* Main Chat Area */}
        <div className="space-y-6">
          {/* Chat Messages Container */}
          <motion.div
            className="flex-1 space-y-4 min-h-[calc(100vh-16rem)] pb-24 overflow-y-auto"
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

          {/* Input Area */}
          <motion.div
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-[calc(100%-32px)] md:max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="p-2 backdrop-blur-sm bg-background/50 border-muted shadow-lg">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex items-center space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about the video..."
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!hasMessage}
                  className={cn(
                    "shrink-0 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white",
                    !hasMessage && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
