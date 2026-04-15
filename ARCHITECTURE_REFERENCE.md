# File Structure Reference

Quick reference for the scalable architecture.

## ⚠️ Path Alias Convention

**ALL imports must use `@/` prefix. NO relative paths allowed.**

```tsx
// ✅ Correct
import { Button } from '@/shared/ui/button';
import { OrgCard } from '@/modules/organization/components/org-card';
import { organizationApi } from '@/services/organization.api';

// ❌ Wrong - Never use relative imports
import { Button } from '../button';
import { OrgCard } from '../components/org-card';
```

Refer to [PATH_ALIAS_CONVENTION.md](./PATH_ALIAS_CONVENTION.md) for complete details.

## File Structure

```
src/
│
├── main.tsx                          # 🔥 Application entry point
│                                     # Renders root element with providers
│
├── App.tsx                           # Root component wrapper
│                                     # Initializes auth check and providers
│
├── providers/                        # 🔥 Global context providers
│   ├── app-provider.tsx              # Combines all providers
│   ├── query-provider.tsx            # React Query setup (server state)
│   └── router-provider.tsx           # React Router setup
│
├── routes/                           # 🔥 Routing system
│   ├── app-routes.tsx                # Main router configuration
│   │                                 # Defines all routes with lazy loading
│   ├── route-constants.ts            # All paths centralized
│   │                                 # Use instead of hardcoded strings
│   └── route-guards.tsx              # Auth / RBAC components & hooks
│
├── layouts/                          # Global UI structure
│   ├── dashboard.layout.tsx          # Protected routes layout (with sidebar)
│   └── auth.layout.tsx               # Public routes layout (centered form)
│
├── modules/                          # 🔥 Feature-based modules
│   │                                 # Each module is self-contained
│   │                                 # Can be developed independently
│   │
│   ├── organization/
│   │   ├── pages/
│   │   │   ├── org-list.page.tsx     # List all organizations
│   │   │   ├── org-create.page.tsx   # Create new organization
│   │   │   └── org-detail.page.tsx   # View organization details
│   │   │
│   │   ├── components/               # Organization-specific components
│   │   ├── hooks/                    # Organization-specific hooks
│   │   └── types/                    # Organization types
│   │
│   ├── workspace/                    # Similar structure
│   ├── campaign/                     # Similar structure
│   ├── template/                     # Similar structure
│   ├── feedback/                     # Similar structure
│   │
│   └── auth/
│       ├── pages/
│       │   └── login.page.tsx
│       ├── components/
│       ├── hooks/
│       └── types/
│
├── services/                         # API layer (server communication)
│   ├── api-client.ts                 # Base HTTP client (axios)
│   │                                 # Handles auth tokens, error handling
│   │                                 # Interceptors for common logic
│   │
│   ├── organization.api.ts           # Organization API endpoints
│   ├── workspace.api.ts              # Workspace API endpoints
│   ├── campaign.api.ts               # Campaign API endpoints
│   └── auth.api.ts                   # (future) Auth API endpoints
│
├── store/                            # Context API (client state)
│   ├── auth/
│   │   └── auth.context.tsx          # User auth state
│   │                                 # useAuth() hook
│   │
│   └── organization/
│       └── org.context.tsx           # Selected org state
│                                     # useOrganization() hook
│
├── shared/                           # Reusable, sharable code
│   ├── ui/                           # shadcn/radix components
│   │                                 # Button, Dialog, Form, etc.
│   │
│   ├── components/                   # Reusable React components
│   │                                 # Header, Sidebar, etc.
│   │
│   ├── hooks/                        # Custom hooks
│   │                                 # useAsync, useLocalStorage, etc.
│   │
│   ├── utils/                        # Utility functions
│   │                                 # formatDate(), parseError(), etc.
│   │
│   └── constants/                    # App-wide constants
│
├── styles/
│   └── globals.css                   # Global styles
│                                     # Tailwind setup
│
└── types/
    └── index.ts                      # Global type definitions
                                      # Common interfaces
```

## Module Structure Details

Each main feature has this structure:

```
modules/feature-name/
├── pages/              # Route components (page-level)
│   ├── list.page.tsx
│   ├── create.page.tsx
│   ├── detail.page.tsx
│   └── edit.page.tsx
│
├── components/         # Feature-specific components
│   ├── item-card.tsx
│   ├── item-form.tsx
│   └── item-modal.tsx
│
├── hooks/              # Feature-specific hooks
│   ├── use-items.ts    # Data fetching
│   ├── use-form.ts     # Form handling
│   └── use-filters.ts  # Filter logic
│
└── types/              # Feature-specific types
    └── index.ts
```

## Usage Examples

### Importing Components

Always use `@/` path aliases:

```tsx
// From same module - use @/ for consistency
import { OrgCard } from '@/modules/organization/components/org-card';

// From shared
import { Button } from '@/shared/ui/button';
import { useAsync } from '@/shared/hooks/use-async';

// From services
import { organizationApi } from '@/services/organization.api';

// From constants
import { ROUTES } from '@/routes/route-constants';

// From types
import { Organization } from '@/modules/organization/types';
```

### Using API Services

```tsx
// In component with React Query
import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '@/services/organization.api';

const { data, isLoading, error } = useQuery({
  queryKey: ['organizations'],
  queryFn: () => organizationApi.getOrganizations(),
});
```

### Using Context Providers

```tsx
// In providers/app-provider.tsx
<QueryProvider>
  <RouterProvider>
    <AuthProvider>
      <OrgProvider>
        {children}
      </OrgProvider>
    </AuthProvider>
  </RouterProvider>
</QueryProvider>
```

### Using Hooks

```tsx
// Auth hook
const { user, isAuthenticated, login, logout } = useAuth();

// Organization hook
const { selectedOrganization, organizations } = useOrganization();
```

## Key Principles

1. **Feature-based**: Code organized by feature, not by type
2. **Modular**: Each feature is self-contained
3. **Scalable**: Easy to add new features without affecting existing code
4. **Type-safe**: TypeScript throughout
5. **Reusable**: Common code goes to `shared/`
6. **Testable**: Clear boundaries make testing easier
7. **Maintainable**: Clear structure and naming conventions
