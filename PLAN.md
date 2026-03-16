# Blunder Client - Development Plan

## Overview
Build a minimal Thunder Client-like API testing tool with a UI-first approach. All UI components will be built with mock data before wiring up actual functionality.

## Design Principles
- **Dark mode native**: No light/dark variants, dark-only design system
- **Small, focused components**: Single responsibility, easy to read
- **UI-first development**: Build all UI with mock data, wire up logic in separate commits

---

## Phase 1: Foundation & Design System

### Commit 1: Dark mode design tokens and base styles
**Goal**: Establish consistent dark mode color palette and typography

**Components/Changes**:
- Update `globals.css` with dark-only color system (zinc-900, zinc-800, etc.)
- Remove all light mode CSS variables
- Define consistent spacing, border radius, shadows
- Set up base typography scale

**Files**:
- `app/globals.css`

---

## Phase 2: Request Builder UI

### Commit 2: Method selector and URL input
**Goal**: Basic request configuration inputs

**Components**:
- `app/_components/request/method-selector.tsx` - HTTP method dropdown (GET, POST, etc.)
- `app/_components/request/url-input.tsx` - URL input field with validation styling
- Update `app/_components/request.tsx` to use these components

**Mock Data**: Hardcoded method="GET", url=""

---

### Commit 3: Request tabs (Headers, Body, Auth)
**Goal**: Tab navigation for request configuration sections

**Components**:
- `app/_components/ui/tabs.tsx` - Reusable tab component
- `app/_components/request/request-tabs.tsx` - Container for request tabs
- Update `app/_components/request.tsx` to include tabs

**Mock Data**: Active tab state, no content yet

---

### Commit 4: Headers editor
**Goal**: Key-value editor for HTTP headers

**Components**:
- `app/_components/request/headers-editor.tsx` - List of header rows
- `app/_components/request/header-row.tsx` - Single header key-value input pair
- `app/_components/ui/button.tsx` - Reusable button component (for add/remove)

**Mock Data**: Array of `{key: "", value: ""}` objects, can add/remove rows

---

### Commit 5: Body editor with content type
**Goal**: Request body input with content type selector

**Components**:
- `app/_components/request/body-editor.tsx` - Body input container
- `app/_components/request/content-type-selector.tsx` - Dropdown (JSON, Text, Form-data, etc.)
- `app/_components/request/body-textarea.tsx` - Textarea for body content
- `app/_components/ui/textarea.tsx` - Reusable textarea component

**Mock Data**: Selected content type, body text (can type but not sent)

---

### Commit 6: Authentication section
**Goal**: Auth configuration (None, Bearer Token, Basic Auth)

**Components**:
- `app/_components/request/auth-selector.tsx` - Auth type dropdown
- `app/_components/request/auth-bearer.tsx` - Bearer token input
- `app/_components/request/auth-basic.tsx` - Username/password inputs
- `app/_components/request/auth-section.tsx` - Container that shows appropriate auth component

**Mock Data**: Selected auth type, token/credentials (not used yet)

---

### Commit 7: Send button and request card polish
**Goal**: Complete request builder UI with proper layout

**Components**:
- `app/_components/request/send-button.tsx` - Primary action button
- `app/_components/request/request-card.tsx` - Card wrapper with title
- Polish spacing, borders, shadows

**Mock Data**: Button shows loading state on click (no actual request)

---

## Phase 3: Response Viewer UI

### Commit 8: Response card and status display
**Goal**: Response container with status code and metadata

**Components**:
- `app/_components/response/response-card.tsx` - Card wrapper
- `app/_components/response/status-badge.tsx` - Status code badge (color-coded)
- `app/_components/response/response-meta.tsx` - Duration, size, etc.

**Mock Data**: Hardcoded status=200, duration="123ms", size="1.2KB"

---

### Commit 9: Response tabs (Body, Headers, Timeline)
**Goal**: Tab navigation for response sections

**Components**:
- `app/_components/response/response-tabs.tsx` - Response tab container
- Reuse `app/_components/ui/tabs.tsx`

**Mock Data**: Active tab state

---

### Commit 10: Response headers table
**Goal**: Display response headers in a clean table

**Components**:
- `app/_components/response/headers-table.tsx` - Table container
- `app/_components/response/header-row.tsx` - Table row for single header

**Mock Data**: Array of mock headers `[{key: "content-type", value: "application/json"}]`

---

### Commit 11: Response body viewer
**Goal**: Display response body with syntax highlighting and formatting

**Components**:
- `app/_components/response/body-viewer.tsx` - Container
- `app/_components/response/json-viewer.tsx` - Collapsible JSON tree (reuse from earlier work)
- `app/_components/response/text-viewer.tsx` - Plain text display
- `app/_components/response/image-viewer.tsx` - Image preview (if content-type is image)
- `app/_components/response/body-formatter.tsx` - Detects content type and renders appropriate viewer

**Mock Data**: Mock JSON response, can expand/collapse tree

---

### Commit 12: Empty and error states
**Goal**: Handle no response and error states

**Components**:
- `app/_components/response/empty-state.tsx` - "Send a request to see response"
- `app/_components/response/error-state.tsx` - Error message display

**Mock Data**: Conditional rendering based on mock state

---

## Phase 4: Layout & Navigation

### Commit 13: Sidebar navigation (collections placeholder)
**Goal**: Sidebar for future collections feature

**Components**:
- `app/_components/layout/sidebar.tsx` - Sidebar container
- `app/_components/layout/sidebar-item.tsx` - Navigation items
- Update main layout to include sidebar

**Mock Data**: Hardcoded list of "Collections" (non-functional)

---

### Commit 14: Main layout refinement
**Goal**: Polish overall layout, spacing, responsive behavior

**Components**:
- `app/_components/layout/main-layout.tsx` - Main container
- Ensure mobile responsiveness
- Proper grid/flex layouts

---

## Phase 5: Wire Up Functionality

### Commit 15: API proxy route
**Goal**: Server-side proxy to handle requests (bypass CORS)

**Files**:
- `app/api/proxy/route.ts` - POST endpoint that forwards requests

**Functionality**: Accepts request config, makes HTTP request, returns response

---

### Commit 16: Request state management
**Goal**: Connect request form to actual state

**Changes**:
- Update `app/_components/request.tsx` to manage all form state
- Connect inputs to state
- Validate URL before allowing send

---

### Commit 17: Send request functionality
**Goal**: Wire up send button to make actual API calls

**Changes**:
- Connect send button to fetch `/api/proxy`
- Handle loading states
- Pass request config to proxy

---

### Commit 18: Display real response
**Goal**: Show actual API response in response viewer

**Changes**:
- Update `app/_components/response` components to accept real response data
- Parse and format real response body
- Display real headers, status, timing

---

### Commit 19: Error handling
**Goal**: Handle network errors, invalid URLs, etc.

**Changes**:
- Error boundaries
- Display error messages in UI
- Handle proxy errors gracefully

---

## Phase 6: Polish & Enhancements

### Commit 20: Request history (localStorage)
**Goal**: Save recent requests

**Components**:
- `app/_components/history/history-list.tsx` - List of recent requests
- `app/_components/history/history-item.tsx` - Single history item
- Load from localStorage, save on successful request

---

### Commit 21: Keyboard shortcuts
**Goal**: Common shortcuts (Cmd+Enter to send, etc.)

**Changes**:
- Add keyboard event handlers
- Document shortcuts

---

### Commit 22: Copy response features
**Goal**: Copy response body, headers, curl command

**Components**:
- `app/_components/response/copy-button.tsx` - Copy to clipboard
- Generate curl command from request

---

## Component Structure

```
app/
├── _components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── tabs.tsx
│   │   └── card.tsx
│   ├── request/               # Request builder components
│   │   ├── method-selector.tsx
│   │   ├── url-input.tsx
│   │   ├── request-tabs.tsx
│   │   ├── headers-editor.tsx
│   │   ├── header-row.tsx
│   │   ├── body-editor.tsx
│   │   ├── content-type-selector.tsx
│   │   ├── auth-section.tsx
│   │   ├── auth-bearer.tsx
│   │   ├── auth-basic.tsx
│   │   ├── send-button.tsx
│   │   └── request-card.tsx
│   ├── response/              # Response viewer components
│   │   ├── response-card.tsx
│   │   ├── status-badge.tsx
│   │   ├── response-meta.tsx
│   │   ├── response-tabs.tsx
│   │   ├── headers-table.tsx
│   │   ├── body-viewer.tsx
│   │   ├── json-viewer.tsx
│   │   ├── text-viewer.tsx
│   │   ├── empty-state.tsx
│   │   └── error-state.tsx
│   ├── layout/                # Layout components
│   │   ├── sidebar.tsx
│   │   ├── sidebar-item.tsx
│   │   └── main-layout.tsx
│   ├── history/               # History components (future)
│   │   ├── history-list.tsx
│   │   └── history-item.tsx
│   └── header.tsx
├── lib/
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
└── api/
    └── proxy/
        └── route.ts           # API proxy endpoint
```

## Color Palette (Dark Native)

- Background: `bg-black` (main), `bg-zinc-900` (cards), `bg-zinc-800` (hover)
- Text: `text-zinc-50` (primary), `text-zinc-400` (secondary), `text-zinc-500` (tertiary)
- Borders: `border-zinc-800`, `border-zinc-700`
- Accents: Status colors (green for 2xx, red for 4xx/5xx, etc.)
- Focus rings: `ring-zinc-700`, `ring-zinc-600`

## Notes

- Each commit should be focused and testable
- UI commits should work with mock data (no API calls)
- Functionality commits should wire up existing UI
- Keep components under 150 lines when possible
- Use TypeScript strictly (no `any`)
- Follow Next.js App Router conventions
