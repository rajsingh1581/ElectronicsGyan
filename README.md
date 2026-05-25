# Electronics Gyan - Engineering Platform Blueprint

Welcome to the **Electronics Gyan** platform blueprint! This repository serves as the scalable, robust foundation for a content-rich engineering community, designed exactly to technical specifications.

## 🚀 Tech Stack Recommendation
- **Frontend/Framework:** [Next.js 15 (App Router)](https://nextjs.org/) for superior SEO, routing, and React Server Components performance.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) mapped to the specific Dark Theme & Lime/Olive Green (`#809A16`) brand identity.
- **Animations:** `motion/react` (Framer Motion) for fluid Mega-Menu and mobile drawer interactions.
- **Database/ORM:** [PostgreSQL via Prisma ORM](https://www.prisma.io/). Ideal for structured, relational data (Projects, Articles, BOMs, Users).
- **Icons:** `lucide-react` for simple, professional vector iconography.
- **Content Rendering:** (Suggested) `next-mdx-remote` or `react-markdown` to parse rigorous engineering articles and code snippets.

---

## 🎨 Brand Identity

- **Backgrounds:** Deep Slate Gray (`#0f1115` & `#1e293b`).
- **Typography:** **Space Grotesk** for clean, tech-forward headings paired with **Inter** for highly legible, dense article body text.
- **Accent Color:** Lime/Olive Green (`#809A16`) mapped to `--color-brand` for primary actions, active state links, and highlights.

---

## 📂 Core Boilerplate Architecture

### 1. The Global Layout & CSS Config
- Defined deep in `app/globals.css` using the new Tailwind v4 `@theme` block.
- Injected `Inter` and `Space_Grotesk` standard fonts in `app/layout.tsx`.

### 2. Responsive Mega-Menu (`components/Navbar.tsx`)
Features a tailored desktop header utilizing Mega-Menu interactions, mapping exactly to:
- Electronics Projects (Highlighted active states)
- Software, Mechanical, Instrumentation
- Biomedical, Project Ideas, Contact, Partner
Mobile layout efficiently collapses into an animated drawer (`AnimatePresence` and `motion`) preventing layout clutter. 

### 3. High-Performance Search UI (`app/page.tsx`)
A global search bar implemented aggressively on the primary Hero layout tailored to search content seamlessly.

### 4. Database Schema Blueprint (`prisma/schema.prisma`)
The core Prisma file is provided spanning exact CMS criteria:
- **Articles & Projects Entity:** Rich text relations supporting complex metadata.
- **BomItem & Component Database:** Relationships specifying components, datasheets, pinout diagrams, and exact quantities required per project.
- **Category Slugging:** Enabling elegant SEO routing (e.g., `/electronics/embedded`).

---

## 🛠 Setup Instructions

### 1. Environment Setup

*By default, AI Studio executes Next.js internally via the `.env.example` configurations.*

Ensure you have Node.js installed, then execute:

```bash
npm install
```

### 2. Prisma Database Integration (Local/Supabase)

To link this schema to a live Postgres instance (like Supabase or Heroku Postgres), configure your remote URL:

1. Copy `.env.example` to `.env`
2. Add your database URL:
```env
DATABASE_URL="postgres://postgres:[PASSWORD]@db.[SUPABASE-PROJECT-ID].supabase.co:5432/postgres"
```
3. Push the schema to your live database:
```bash
npx prisma db push
```
4. Generate the Prisma Client for your Next.js API routes:
```bash
npx prisma generate
```

### 3. Running the Server

Start the application (runs on `PORT 3000` via AI studio):

```bash
npm run dev
```

Next step in development is implementing MDX rendering via dynamic routes (`/app/articles/[slug]/page.tsx`) mapping to the Prisma `Article` database fetch.
