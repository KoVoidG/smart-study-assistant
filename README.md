# 🎓 Smart Study Assistant

🚀 **Live Site**: [https://smart-study-assistant-taupe.vercel.app/](https://smart-study-assistant-taupe.vercel.app/)

[![Next.js Framework](https://img.shields.io/badge/Framework-Next.js%2015-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Database & Auth](https://img.shields.io/badge/Backend-Supabase-green?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)


Smart Study Assistant is an intelligent web application designed to help students optimize their learning experience. It allows users to write or upload study notes, automatically classify topics, generate concise summaries, take interactive practice quizzes, simplify complex ideas, and chat directly with their notes.

Powered by **Next.js (App Router)**, **Supabase** (Auth, Database, and Row-Level Security), and **OpenRouter AI** models.

---

## ✨ Features

### 🧠 AI Cognitive Toolkit
* **Summarization**: Condenses extensive notes into structured markdown summaries and key bullet points.
* **Interactive Quizzes**: Generates dynamic Multiple Choice and Short Answer practice questions. Answers are checked in real-time with instant validation and comparisons.
* **Feynman Explanation**: Simplifies complex terms, physics concepts, or mathematical formulas using easy-to-understand analogies.
* **Contextual Note Chat**: A dedicated sidebar chat interface to query and discuss the contents of study notes.
* **Automatic Topic Tagging**: Automatically classifies document contents into core academic subjects (*Biology, Physics, Chemistry, Mathematics, Computer Science, History, Literature, Economics, or Other*).

### 📁 Smart Document Management
* **PDF & Document Parsing**: Extracts text from PDF, TXT, DOC, and DOCX documents with robust binary stream parsing and a 10MB safety boundary.
* **Saves vs. History Separation**: Restructures documents into static verified files (**My Notes**) and dynamic search sessions (**History**).
* **Smart Syncing**: Automatically auto-saves generation runs to history while avoiding duplication. The "Save" button updates existing history files instead of cluttering the database.

### 🛡️ Hardened Security
* **Row-Level Security (RLS)**: Enforces table isolation in PostgreSQL ensuring data is strictly private to the authenticated owner.
* **Forgot Password Recovery**: Secure PKCE flow utilizing server-side routing handlers to exchange codes for auth sessions and update credentials.
* **Password-Authenticated Deletion**: Deleting accounts requires password verification and triggers a cascading wipe of all associated files and configurations.

### 🎨 State-of-the-Art UX/UI
* **Adaptive Dark Mode**: Sleek slate-charcoal interface with glowing violet highlights, powered entirely by CSS variables to prevent Server-Side Rendering (SSR) hydration flashes.
* **Symmetrical Layout**: Balanced layout matching the heights of the note workspace and the AI Results panel on desktop screens.
* **Custom Favicon & Branding**: Professional custom BookOpen browser favicon replacing default Next.js templates.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router, React 19), Tailwind CSS
* **Database & Authentication**: Supabase (PostgreSQL, GoTrue, Row Level Security)
* **AI Cognitive Processing**: OpenRouter API (utilizing free-tier LLM models)
* **File Processing**: `pdf-parse`

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or higher is recommended).

### 2. Configuration (`.env.local`)
Create a `.env.local` file in the root of the project with the following configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Provider Configuration
OPENROUTER_API_KEY=your-openrouter-free-api-key
```

### 3. Database Schema Setup
Execute the SQL scripts inside `supabase/schema.sql` within your Supabase project's SQL editor to set up the necessary tables, policies, triggers, and RPC functions.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Production Builds

To compile and optimize the application for production deployment, run:
```bash
npm run build
```

To preview the built production site locally, run:
```bash
npm run start
```

---

## ☁️ Deployment

The application is fully compatible with **Vercel** out of the box:

1. Push the code repository to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import the repository.
4. Input the environment variables (from `.env.local`) in Vercel's **Environment Variables** configuration.
5. Click **Deploy**. Vercel will bundle the codebase and host it on HTTPS.
