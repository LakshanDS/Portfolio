# Portfolio Management System

A modern, full-stack portfolio management application built with Next.js 16, Prisma, and SQLite. Features a responsive design, admin dashboard, and real-time content management.

## Features

- **Dynamic Content Management**: Update projects, skills, education, experience, and more through admin dashboard
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Dashboard**: Secure admin panel for managing all content
- **Real-time Analytics**: Track page visits and engagement
- **Resume Generation**: Download resume as PDF with customizable content
- **SEO Optimized**: Built-in SEO best practices
- **Dark Mode Theme**: Professional dark-themed design
- **Icon System**: Extensive icon library with color customization
- **Two-Factor Authentication**: TOTP-based admin login with Google Authenticator
- **Session Management**: Secure session-based authentication with automatic expiration

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF Generation**: @react-pdf/renderer

### Backend
- **Database**: SQLite with Better SQLite3 adapter
- **ORM**: Prisma 7
- **API**: Next.js API Routes
- **Authentication**: Session-based auth with TOTP (OTPAuth)
- **Password Hashing**: bcryptjs

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LakshanDS/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your values:
   ```env
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET=your-64-character-random-secret-here
   ```

   **Generate SESSION_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

 4. **Initialize the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:push
   
   # Seed the database
   npm run db:seed
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema changes to database |
| `npm run prisma:seed` | Seed database (additive) |
| `npm run db:reset` | Reset database and seed fresh data |
| `npm run db:seed` | Seed database with fresh data |
| `npm run seed-admin` | Seed admin user (if needed) |

## Project Structure

```
Portfolio/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/              # Database migrations
│   ├── seed.ts                # Additive seed
│   └── seed-fresh.ts          # Fresh seed (primary)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── jasladmin/         # Admin dashboard
│   │   ├── projects/           # Projects pages
│   │   ├── about/              # About page
│   │   ├── roadmap/             # Roadmap page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── home/               # Homepage components
│   │   ├── projects/            # Project components
│   │   ├── roadmap/             # Roadmap components
│   │   ├── resume/              # Resume components
│   │   ├── layout/              # Layout components
│   │   ├── analytics/           # Analytics components
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       ├── prisma.ts            # Prisma client
│       ├── data.ts              # Data fetching functions
│       ├── auth.ts              # Authentication functions
│       ├── types.ts             # TypeScript types
│       ├── utils.ts             # Utility functions
│       └── iconMap.ts           # Icon mapping
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore patterns
├── schema.sql                 # SQL schema reference
└── README.md                  # This file
```

## Database Schema

The application uses the following main entities:

- **Project**: Portfolio projects with details, tags, and status
- **RoadmapItem**: Career and learning milestones
- **Profile**: Personal information and links
- **ProfileStatus**: Work availability status
- **ProfileStats**: Statistics and metrics
- **SkillCategory**: Categories for skills
- **Skill**: Individual skills with icons
- **CoreCompetency**: Key areas of expertise
- **Education**: Educational background
- **Experience**: Work experience
- **AboutCard**: Feature cards for about section
- **PageVisit**: Page visit analytics
- **Comment**: Contact form submissions

See `schema.sql` for complete database structure and relationships.

## API Routes

### Public Routes
- `GET /api/projects` - List all projects
- `GET /api/projects/[id]` - Get project details
- `GET /api/roadmap` - List roadmap items
- `GET /api/skills` - List all skills
- `GET /api/core-competencies` - List core competencies
- `GET /api/profile` - Get profile information
- `GET /api/education` - Get education history
- `GET /api/experience` - Get work experience
- `GET /api/about-cards` - Get about section cards
- `GET /api/homepage-settings` - Get homepage settings
- `GET /api/about-settings` - Get about settings
- `GET /api/projects-settings` - Get projects settings
- `GET /api/roadmap-settings` - Get roadmap settings
- `GET /api/icons` - List available icons
- `GET /api/comments` - List comments
- `GET /api/track-visit` - Track page visits
- `GET /api/download-resume` - Download resume as PDF

### Admin Routes (Protected)
- `POST /api/login` - Admin login
- `POST /api/projects/create` - Create new project
- `POST /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/skills/manage` - Create/update skill
- `DELETE /api/skills/manage` - Delete skill
- `POST /api/skills/items` - Manage skill items
- `POST /api/skills/categories` - Manage categories
- `POST /api/core-competencies/manage` - Manage competencies
- `POST /api/roadmap/manage` - Create/update roadmap item
- `DELETE /api/roadmap/manage` - Delete roadmap item
- `POST /api/education/manage` - Manage education
- `DELETE /api/education/manage` - Delete education
- `POST /api/experience/manage` - Manage experience
- `DELETE /api/experience/manage` - Delete experience
- `POST /api/profile/manage` - Update profile
- `POST /api/about-cards/manage` - Manage about cards
- `DELETE /api/about-cards/manage` - Delete about card
- `POST /api/homepage-settings` - Update homepage settings
- `POST /api/about-settings` - Update about settings
- `POST /api/projects-settings` - Update projects settings
- `POST /api/roadmap-settings` - Update roadmap settings
- `POST /api/admin/dashboard` - Dashboard statistics
- `POST /api/admin/status` - Admin status check

## Admin Dashboard

Access the admin panel at `/jasladmin/login`.

**Authentication:**
- The admin panel uses TOTP-based admin authentication
- First-time setup requires scanning a QR code with Google Authenticator or similar app
- The TOTP secret is stored in the database and used to generate time-based codes
- Sessions are automatically managed with expiration

The admin dashboard provides:
- **Dashboard**: Overview with statistics
- **Projects**: Create, edit, delete projects
- **Skills**: Manage skill categories and items
- **Competencies**: Update core competencies
- **Education**: Add educational background
- **Experience**: Manage work experience
- **Roadmap**: Update career milestones
- **Profile**: Update personal information
- **Settings**: Configure sections and appearance

## Deployment

### Manual Deployment

1. **Build the application**
    ```bash
    npm run build
    ```

2. **Set production environment variables**
    ```env
    DATABASE_URL="file:./prod.db"
    SESSION_SECRET=your-64-character-random-secret-here
    ```

3. **Run migrations**
    ```bash
    npx prisma migrate deploy
    ```

4. **Seed database (if needed)**
    ```bash
    npm run db:seed
    ```

5. **Start production server**
    ```bash
    npm start
    ```

## Troubleshooting

### Database Issues

```bash
# Reset database
npm run db:fresh

# Regenerate Prisma Client
npm run prisma:generate

# Push schema changes
npm run prisma:push
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Prisma cache
npx prisma generate --force
```

## Author

J Avindu Lakshan De Silva