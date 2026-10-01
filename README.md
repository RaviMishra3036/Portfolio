# Portfolio

A modern portfolio website built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Overview

This project is a personal portfolio and admin dashboard that lets you:

- showcase your profile, projects, education, certifications, services, and achievements
- manage content from an admin panel
- receive messages through a contact form
- connect portfolio data with Supabase
- use a dark, glassmorphism-inspired UI

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Lucide React

## Features

- Portfolio landing page with sections for About, Skills, Projects, Services, Resume, and Contact
- Admin login and protected dashboard
- Editable profile content
- Project, skill, education, certification, achievement, and social link management
- Contact details editing from the admin panel
- Message inbox for contact form submissions
- Responsive design for desktop and mobile

## Project Structure

```bash
src/
  components/
  context/
  hooks/
  lib/
  pages/
  App.tsx
  main.tsx
supabase/
  migrations/
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+
- npm
- a Supabase project

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run Locally

```bash
npm run dev
```

The app will run on the local Vite server, usually at:

```bash
http://localhost:5173
```

## Production Build

```bash
npm run build
```

## Type Check

```bash
npm run typecheck
```

## Admin Panel

After configuring Supabase, log in to the admin section and update:

- Profile
- About Me
- Projects
- Skills
- Education
- Certifications
- Services
- Contact Me
- Social Links
- Settings

## Supabase Setup

This project uses the SQL migrations under `supabase/migrations/` to create the required tables and RLS policies.

## License

This project is for personal portfolio use.

## Author

Ravi Mishra