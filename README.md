# School Portal Builder

A React-based application for building and managing school portals with customizable branding, surveys, and file management.

## Features

- **School Branding**: Customize school name, logo, colors, and tagline
- **File Uploads**: Manage files and resources for the school portal
- **Survey Builder**: Create and manage surveys for students, parents, and staff
- **Portal Preview**: Preview the public-facing school portal
- **Public Survey**: Standalone survey interface for respondents
- **Role Switcher**: Development tool to switch between Admin, Teacher, and Viewer roles

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Main app component with routing
├── index.css             # Global styles with Tailwind
├── types.d.ts            # TypeScript type definitions
├── data/
│   └── mockData.ts       # Mock data for schools, surveys, files
├── components/
│   ├── Navbar.tsx        # Navigation bar with role-based menu
│   └── RoleSwitcher.tsx  # Dev tool for switching user roles
├── pages/
│   ├── AdminBranding.tsx # School branding customization
│   ├── Uploads.tsx       # File upload management
│   ├── SurveyBuilder.tsx # Survey creation and management
│   ├── PreviewPortal.tsx # Public portal preview
│   └── PublicSurvey.tsx  # Public survey interface
└── hooks/
    └── useLocalStorage.ts # LocalStorage hook for state persistence
```

## Routes

- `/admin` - School branding and customization
- `/uploads` - File management
- `/survey-builder` - Survey creation and management
- `/preview` - Portal preview
- `/public-survey` - Public survey interface (no navigation)

## Role-Based Access

The application includes a development-only role switcher that allows you to test different user perspectives:

- **Admin**: Full access to all features
- **Teacher**: Access to uploads, survey builder, and preview
- **Viewer**: Read-only access to preview

## Notes

- All data is stored in static mock files (no backend required)
- User role preference is persisted in localStorage
- The application uses stock photos from Pexels for demo purposes
