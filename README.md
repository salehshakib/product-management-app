# Product Management App

A modern, full-featured product management application built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive solution for managing products, categories, and user authentication with a beautiful, responsive UI.

## Features

- **Product Management**: Create, read, update, and delete products with detailed information
- **Category Management**: Organize products by categories
- **Image Upload**: Upload and manage product images with Cloudinary integration
- **Search & Filter**: Search products by name/description and filter by category
- **Pagination**: Efficient data loading with pagination support
- **Authentication**: Secure login system with JWT token-based authentication
- **Dark Mode**: Built-in theme switching with next-themes
- **Responsive Design**: Mobile-first design that works on all devices
- **Form Validation**: Robust form handling with react-hook-form and Zod
- **Optimistic Updates**: Smooth user experience with TanStack Query

## Tech Stack

### Core
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### UI Components
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **shadcn/ui** - Re-usable component library

### State & Data Management
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Image Management
- **Next Cloudinary** - Image upload and optimization

### Utilities
- **class-variance-authority** - CSS variant management
- **clsx** & **tailwind-merge** - Conditional CSS classes
- **use-debounce** - Debounced values and callbacks
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=your_api_base_url

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
product-management-app/
├── app/                        # Next.js App Router
│   ├── (protected-routes)/    # Protected pages requiring authentication
│   │   ├── layout.tsx         # Protected layout with sidebar/header
│   │   ├── page.tsx           # Dashboard
│   │   ├── products/          # Product pages
│   │   └── categories/        # Category pages
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/                # React components
│   ├── common/                # Shared components
│   ├── products/              # Product-specific components
│   ├── ui/                    # shadcn/ui components
│   ├── header.tsx             # Header component
│   └── sidebar.tsx            # Sidebar navigation
├── providers/                 # Context providers
│   ├── auth-provider.tsx      # Authentication context
│   ├── query-client-provider.tsx  # React Query setup
│   ├── theme-provider.tsx     # Theme switching
│   └── cloudinary-provider.tsx    # Cloudinary config
├── hooks/                     # Custom React hooks
│   └── queries/               # React Query hooks
├── api/                       # API configuration
│   └── endpoints/             # API endpoint definitions
├── lib/                       # Utility functions
│   ├── utils.ts               # General utilities
│   ├── custom-fetch.ts        # API fetch wrapper
│   └── image-upload.ts        # Image upload utilities
├── types/                     # TypeScript type definitions
└── public/                    # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Key Features Explained

### Authentication
The app uses JWT token-based authentication stored in localStorage. Protected routes are wrapped in an authentication provider that checks for valid tokens and redirects to login if necessary.

### Data Fetching
TanStack Query is used for efficient server state management with features like:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading and error states

### Image Upload
Products can have multiple images uploaded through Cloudinary integration, providing:
- Automatic image optimization
- CDN delivery
- Responsive image serving

### Search & Filtering
Real-time search with debouncing and category-based filtering with URL-based state management for shareable links.

## API Integration

The application integrates with a RESTful API for all data operations. API endpoints are centrally configured in [api/endpoints/api.ts](api/endpoints/api.ts).

### Authentication Headers
All API requests automatically include JWT tokens when available for authenticated endpoints.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team at BitechX Solutions.

---

Built with dedication by Saleh Shakib
