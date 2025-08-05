# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with host flag for network access
- `npm run build` - Build for production (runs type-check and build-only in parallel)
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run Vue TypeScript compiler for type checking
- `npm run format` - Format code using Prettier

### Environment Variables
The application requires these environment variables:
- `VITE_APP_ROOT` - Root path of the app (defaults to `/`)
- `VITE_APP_URL` - Public URL where the app is hosted
- `VITE_API_CAMPUS` - Campus name for Pioneer Food Services API
- `VITE_API_URL` - Pioneer Food Services API endpoint

## Architecture Overview

### Application Structure
This is a Vue 3 + TypeScript Progressive Web App (PWA) for displaying dynamic dining hall menus on digital signage devices. The app integrates with Pioneer Food Services API and supports offline functionality.

### Key Technologies
- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety
- **Pinia** for state management
- **Vue Router** for routing with authentication guards
- **Dexie.js** for IndexedDB database operations
- **Tailwind CSS** with Vite plugin for styling
- **Temporal Polyfill** for date/time operations
- **Workbox** for service worker and offline capabilities

### Database Schema (IndexedDB via Dexie)
- `configuration` - App settings, layout, device info, menus, refresh rates
- `menus` - Cached menu data indexed by date
- `layouts` - Available layout components (GridLayout, etc.)
- `venues` - Venue names and API mappings
- `devices` - Device specifications and dimensions

### Core Architecture Patterns

#### State Management
- **Configuration Store** (`configurationStore.ts`) - Centralized app configuration with computed properties for colors, dimensions, layout settings
- **Device/Layout Stores** - Additional stores for specific concerns
- Uses Pinia's `defineStore` with Composition API pattern

#### Data Flow
1. **Menu Data**: Pioneer API → Local cache (Dexie) → Vue components
2. **Configuration**: IndexedDB → Pinia store → Reactive computed properties
3. **Periodic Sync**: Background sync updates menu data on intervals

#### Authentication & Routing
- Route guards in router protect `/config` routes
- Simple PIN-based authentication for configuration access
- Automatic logout when leaving config section

#### PWA Features
- **Kiosk Mode**: Full-screen display starting at `/kiosk` route
- **Service Worker**: Auto-updating with 1-hour refresh intervals
- **Background Sync**: Periodic menu updates using composables
- **Offline Support**: Cached menu data available without network

### Key Composables
- `useMenuData()` - Fetches and caches menu data with loading states
- `useAuth()` - Handles authentication state
- `useScheduledMenuSync()` - Background menu synchronization
- `useFullscreen()` - Kiosk mode fullscreen functionality
- `useIdleTimeout()` - Automatic logout on inactivity

### Component Architecture
- **Layouts**: `DeviceLayout.vue`, `GridLayout.vue` for different display modes
- **Pages**: Kiosk display, configuration screens, authentication
- **Reusable Components**: Cards, forms, buttons following consistent patterns
- Uses `@/` alias for src imports

### Menu Data Pipeline
1. Pioneer API provides raw menu data
2. `transformPioneerMenuToMenu()` normalizes data structure
3. Data cached in IndexedDB with date indexing
4. `useMenuData()` composable manages fetch/cache lifecycle
5. Components reactively display current menu based on time/date

### Configuration System
The app supports extensive configuration through the database:
- Device dimensions and orientation
- Color themes and branding
- Menu schedules and venue mappings
- Refresh rate intervals
- Layout component selection

### Time-based Menu Display
- Uses Temporal API for accurate time handling
- Menus configured with start/end times
- Automatic switching between breakfast/lunch/dinner
- Supports scheduling up to 60 menu rotations