# Gaming Admin Dashboard

## Overview

This is a comprehensive gaming admin dashboard built for managing players, tournaments, currency systems, and game mechanics. The application provides a complete backend management interface for a gaming platform with features like player management, tournament administration, currency transactions, ranking systems, rewards management, and anti-cheat monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handling
- **Development Setup**: Hot reload with Vite middleware integration
- **Error Handling**: Centralized error middleware with structured responses
- **Logging**: Custom request/response logging with performance metrics

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Drizzle-Zod integration for runtime schema validation

### Key Data Models
- **Users**: Authentication and basic user management
- **Players**: Gaming profiles with stats, currency, and progression
- **Tournaments**: Event management with entry fees and prize pools
- **Currency Transactions**: Financial tracking for coins and gems
- **Ranking System**: Tier-based progression with seasonal configs
- **Rewards**: Daily rewards and level-based incentives
- **Anti-Cheat**: Security monitoring and violation tracking
- **Events**: Special promotions and multiplier events

### Authentication & Authorization
- Session-based authentication using express-session
- PostgreSQL session storage via connect-pg-simple
- Role-based access patterns (admin dashboard focus)

### API Structure
- RESTful endpoints organized by feature domain
- Standardized response formats with error handling
- Query parameter support for filtering, pagination, and search
- CRUD operations for all major entities

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **connect-pg-simple**: PostgreSQL session store

### UI & Component Libraries
- **Radix UI**: Comprehensive primitive components
- **Shadcn/ui**: Pre-built component system
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel functionality
- **CMDK**: Command palette interface

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling for server code

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class handling
- **class-variance-authority**: Component variant management
- **nanoid**: Unique ID generation

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling integration