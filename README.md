# Docr Frontend

Production-ready frontend for Docr - Automated documentation generation platform.

## Features

- ✅ Complete UI matching your designs
- ✅ Real-time AI streaming with status updates
- ✅ Framer Motion animations throughout
- ✅ Modal and toast notifications (no alerts)
- ✅ Full backend integration
- ✅ Zustand state management
- ✅ Responsive design
- ✅ Production-ready

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand
- **Icons**: Phosphor Icons
- **HTTP**: Axios
- **Notifications**: React Hot Toast

## Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Configure environment:**

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:9000
NEXT_PUBLIC_API_VERSION=v1
```

3. **Run development server:**

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
docr/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── project/       # Project detail pages
│   │   └── layout.tsx     # Dashboard layout
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ai/               # AI status components
│   ├── chat/             # Chat input
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── modals/           # Modal components
│   └── providers/        # Context providers
├── lib/
│   ├── api.ts            # Axios configuration
│   └── api-client.ts     # API client functions
└── store/
    ├── useAuthStore.ts   # Authentication state
    ├── useReposStore.ts  # Repositories state
    ├── useCreditsStore.ts # Credits state
    └── useAIStore.ts      # AI agent state
```

## Key Features

### Real-time AI Streaming

The AI agent streams updates in real-time:
- Status indicators (thinking, executing, completed)
- Step-by-step progress
- Action execution status
- Confirmation requests
- Natural language responses

### Animations

Framer Motion animations on:
- Page transitions
- Component mounts
- Hover states
- Loading states
- Status changes

### State Management

Zustand stores for:
- Authentication
- Repositories
- Credits
- AI agent state

## Pages

- `/` - Landing page
- `/auth` - GitHub OAuth login
- `/auth/callback` - OAuth callback
- `/dashboard` - Main dashboard
- `/dashboard/project/[id]` - Project detail page

## Components

### Layout
- `Sidebar` - Navigation sidebar
- `Header` - Top header with user profile
- `ChatInput` - Bottom chat input
- `AIStatus` - Real-time AI status display

### Modals
- `ConfirmationModal` - AI confirmation dialogs
- `RefillCreditsModal` - Credit refill modal

### Dashboard
- `StatsCard` - Statistics cards
- `ProjectCard` - Repository cards

## API Integration

All API calls are handled through:
- `lib/api.ts` - Axios instance with auth
- `lib/api-client.ts` - API functions

## Building for Production

```bash
pnpm build
pnpm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_API_VERSION` - API version

## Notes

- All data comes from the backend (no static data)
- Real-time updates via streaming
- Smooth animations throughout
- Production-ready code quality
