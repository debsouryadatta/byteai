"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/footer";
import { ArrowRight, Bot, FileText, Youtube, Zap, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const scrollToNextSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 dark:from-cyan-950 dark:via-black dark:to-cyan-950">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-indigo-300/30 to-cyan-300/30 dark:from-indigo-500/20 dark:to-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-blue-300/30 to-purple-300/30 dark:from-blue-500/20 dark:to-purple-500/20 blur-3xl rounded-full" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#64748b12_1px,transparent_1px),linear-gradient(to_bottom,#64748b12_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-gray-200/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              ByteAI
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", id: "hero" },
                { name: "Features", id: "features" },
                { name: "FAQ", id: "faq" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToNextSection(item.id)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 px-4 max-w-5xl mx-auto"
        >
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> AI-Powered Chat </span>
          </Badge>
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
            Chat with Any Content
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-indigo-200/80 max-w-3xl mx-auto">
            Transform your content interaction experience. Chat with websites, PDFs, and YouTube videos using advanced AI technology.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/v1">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 cursor-pointer"
          onClick={() => scrollToNextSection('features')}
        >
          <ChevronDown className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center py-20">
        <div className="container mx-auto px-4 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to interact with your content in a smarter way
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Chat with Websites",
                description: "Enter any URL and start chatting with the website content. Get summaries and answers to your questions instantly.",
                icon: Bot,
              },
              {
                title: "Chat with PDFs",
                description: "Upload your PDFs and interact with them naturally. Perfect for research, study, or quick document analysis.",
                icon: FileText,
              },
              {
                title: "Chat with YouTube",
                description: "Paste a YouTube URL and get video summaries or ask questions about the content without watching the entire video.",
                icon: Youtube,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="h-full"
              >
                <Card className="p-8 space-y-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm h-full flex flex-col">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-16 h-16 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 flex-grow">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center pt-8 cursor-pointer"
            onClick={() => scrollToNextSection('faq')}
          >
            <ChevronDown className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="min-h-screen flex items-center py-20">
        <div className="container mx-auto px-4 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                q: "How does the website chat feature work?",
                a: "Simply paste any website URL, and our AI will analyze the content. You can then ask questions or get summaries about the website content.",
              },
              {
                q: "What file formats are supported for PDF chat?",
                a: "We support standard PDF files. Upload your PDF and start interacting with its content through natural conversation.",
              },
              {
                q: "Can I chat with any YouTube video?",
                a: "Yes! Just paste the YouTube video URL, and you can get summaries or ask specific questions about the video content.",
              },
              {
                q: "Is the service free to use?",
                a: "We offer both free and premium tiers. The free tier includes basic features, while premium unlocks advanced capabilities.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="h-full"
              >
                <Card className="p-8 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{faq.q}</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 flex-grow">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
