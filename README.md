# ByteAI

<div align="center">
<a href="https://github.com/debsouryadatta/byteai">
    <img src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1740058550/projects/byteai.png" alt="Logo" width="800" height="500">
  </a>
</div>

<div align="center">
  <h3>AI-Powered Content Interaction Platform</h3>

  <p align="center">
    Transform your content interaction experience. Chat with websites, PDFs, and YouTube videos using advanced AI technology.
    <br />
    <a href="https://byteai.souryax.tech/">View Live Site</a>
    ·
    <a href="https://github.com/debsouryadatta/byteai/issues">Report Bug</a>
    ·
    <a href="https://github.com/debsouryadatta/byteai/issues">Request Feature</a>
  </p>
</div>

## About The Project

ByteAI is an innovative content interaction platform that transforms how users engage with different types of content. It leverages advanced AI capabilities to enable natural conversations with websites, PDFs, and YouTube videos. Built with modern web technologies and a beautiful, responsive UI using Next.js and Shadcn components, ByteAI makes content interaction more intuitive and intelligent.

## Features

- **Chat with Websites**: Engage in natural conversations about any website's content
- **PDF Interaction**: Have intelligent discussions about PDF document contents
- **YouTube Video Chat**: Interact with YouTube video content through chat
- **User Authentication**: Secure user authentication powered by Clerk
- **Content Management**: Easy management of your chat history and interactions
- **Responsive Design**: Beautiful UI that works seamlessly across all devices
- **Real-time Updates**: Instant chat responses using Next.js App Router
- **Database Integration**: Reliable data storage with Prisma and PostgreSQL
- **Modern UI Components**: Built with Shadcn UI and styled with Tailwind CSS
- **Dark Mode Support**: Elegant dark mode implementation for better user experience

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [Lucide Icons](https://lucide.dev/) - Icon Library
- [Next.js App Router](https://nextjs.org/docs/app) - Server Components and API Routes
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Clerk](https://clerk.com/) - Authentication
- [Google Generative AI](https://ai.google.dev/) - AI-powered conversations
- [LangChain](https://js.langchain.com/) - AI/LLM Framework
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Cloudinary](https://cloudinary.com/) - File Storage
- [Docker](https://www.docker.com/) - Containerization
- [Oracle VM Cloud](https://www.oracle.com/cloud/) - Deployment

## Getting Started

1. Clone the repository
   ```sh
   git clone https://github.com/debsouryadatta/byteai.git
   ```

2. Install dependencies
   ```sh
   pnpm install
   ```

3. Set up environment variables
   ```env
    DATABASE_URL=
    
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
    CLERK_WEBHOOK_SECRET=

    # Base URL
    NEXT_PUBLIC_BASE_URL=
    CRAWL4AI_BE_URL=

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_UPLOAD_PRESET=
    CLOUDINARY_FOLDER=

    # Gemini
    GEMINI_API_KEY=
    GOOGLE_GENERATIVE_AI_API_KEY=
   ```

4. Start the development server
   ```sh
   pnpm run dev
   ```

### One Command With Docker Compose

1. Build the Docker image & run
   ```sh
   docker-compose up --build -d
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Debsourya Datta - [@debsourya005](https://twitter.com/debsourya005)

Project Link: [https://github.com/debsouryadatta/byteai](https://github.com/debsouryadatta/byteai)