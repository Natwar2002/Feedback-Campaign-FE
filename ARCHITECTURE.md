# Scalable Architecture Guide

This document explains the scalable architecture of the Feedback SaaS frontend application.

## Architecture Overview

The project follows a **feature-based modular architecture** with clear separation of concerns:

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root component
├── providers/                # Global state providers
├── routes/                   # Routing configuration
├── layouts/                  # Global layouts
├── modules/                  # Feature-based modules
├── services/                 # API layer
├── store/                    # Context API (state management)
├── shared/                   # Shared utilities and components
├── styles/                   # Global styles
└── types/                    # Global type definitions
```

## Path Aliases (Strict Convention)

This project uses **strict path aliases** (`@/`) for all imports. This provides:
- ✅ Consistent imports throughout the codebase
- ✅ No relative path confusion (`../../../`)
- ✅ Easier refactoring and file movement
- ✅ Better IDE support and autocompletion

**All imports must use `@/` prefix - no relative paths allowed.**

```tsx
// ✅ Correct
import { organizationApi } from '@/services/organization.api';
import { ROUTES } from '@/routes/route-constants';
import { useAuth } from '@/store/auth/auth.context';
import { Button } from '@/shared/ui/button';

// ❌ Wrong - Never use relative paths
import { organizationApi } from '../../../services/organization.api';
import { useAuth } from './auth.context';
```

See [PATH_ALIAS_CONVENTION.md](./PATH_ALIAS_CONVENTION.md) for complete details and examples.

## Core Concepts

### 1. **Providers** (`src/providers/`)
Wraps the entire application with global context providers:

- **app-provider.tsx**: Main provider combining all other providers
- **query-provider.tsx**: React Query for server state management
- **router-provider.tsx**: React Router for navigation

```tsx
// Usage in main.tsx
import { AppProvider } from '@/providers/app-provider';

<AppProvider>
  <App />
</AppProvider>
```

### 2. **Routes** (`src/routes/`)
Centralized routing configuration:

- **route-constants.ts**: All route paths defined as constants (prevents hardcoded paths)
- **app-routes.tsx**: Main routes configuration with lazy loading
- **route-guards.tsx**: Authentication and RBAC protection

```tsx
// Use constants for navigation
import { ROUTES } from '@/routes/route-constants';

navigate(ROUTES.ORGANIZATION.LIST);
navigate(ROUTES.ORGANIZATION.DETAIL(orgId));
```

### 3. **Layouts** (`src/layouts/`)
Wrap routes with consistent UI structure:

- **dashboard.layout.tsx**: For protected routes (sidebar, header, etc.)
- **auth.layout.tsx**: For public routes (login, register, etc.)

### 4. **Modules** (`src/modules/`)
Feature-based modular structure. Each module is self-contained:

```
modules/
├── organization/
│   ├── pages/          # Pages/route components
│   ├── components/     # Local components
│   ├── hooks/          # Local hooks
│   └── types/          # Module-specific types
├── workspace/
├── campaign/
├── template/
├── feedback/
└── auth/
```

**Key principle**: Modules are **self-contained** and can be independently developed, tested, and maintained.

```tsx
// Module structure example:
// src/modules/organization/pages/org-list.page.tsx
import { organizationApi } from '@/services/organization.api';
import { OrgDetailComponent } from '@/modules/organization/components/org-detail';
```

### 5. **Services** (`src/services/`)
API layer abstracting HTTP calls:

- **api-client.ts**: Base HTTP client with Axios (auth interceptors, error handling)
- **organization.api.ts**: Organization endpoints
- **workspace.api.ts**: Workspace endpoints
- **campaign.api.ts**: Campaign endpoints

```tsx
// Usage in components
import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '@/services/organization.api';

const { data } = useQuery({
  queryKey: ['organizations'],
  queryFn: () => organizationApi.getOrganizations(),
});
```

### 6. **Store** (`src/store/`)
Global state management using **Context API**:

```
store/
├── auth/
│   └── auth.context.tsx      # User auth state
└── organization/
    └── org.context.tsx        # Selected organization state
```

```tsx
// Create a context
const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};
```

### 7. **Shared** (`src/shared/`)
Reusable components, hooks, and utilities:

```
shared/
├── ui/              # shadcn/radix components (buttons, dialogs, etc.)
├── components/      # Reusable components (headers, navigation, etc.)
├── hooks/           # Reusable custom hooks
├── utils/           # Helper functions
└── constants/       # App constants
```

### 8. **Types** (`src/types/`)
Global and domain types:

```tsx
export type Id = string | number;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Data Flow

```
Component
  ↓
useQuery/useMutation (React Query)
  ↓
API Services (organizationApi, etc.)
  ↓
API Client (axios with interceptors)
  ↓
Backend API
```

### Example: Fetching Organizations

```tsx
// 1. In component
import { useQuery } from '@tanstack/react-query';
import { organizationApi } from 'src/services/organization.api';

function OrgList() {
  const { data: orgs } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationApi.getOrganizations(), // 2. Call API service
  });
}

// 2. API service calls the API client
class OrganizationApi {
  async getOrganizations() {
    return apiClient.get('/organizations'); // 3. HTTP request
  }
}

// 3. API client handles auth, errors, interceptors
class ApiClient {
  async get(url) {
    // Add auth token
    // Handle errors
    // Retry logic
  }
}
```

## Best Practices

### ✅ Do's

1. **Use path aliases**: Use `@/` for all imports, never use relative paths
2. **Use typed data**: Define interfaces for all API responses and payloads
3. **Centralize routes**: Use `ROUTES` constant instead of hardcoded paths
4. **Separate concerns**: Keep pages, components, hooks, and types separate
5. **Use React Query**: For server state (fetching, caching, mutations)
6. **Use Context API**: For client state (auth, user preferences)
7. **Lazy load routes**: Use `React.lazy()` for code splitting
8. **Create reusable hooks**: Extract logic into custom hooks

### ❌ Don'ts

1. **Don't use relative paths**: Always use `@/` path aliases
2. **Don't hardcode routes**: Always use `ROUTES` constant
3. **Don't make HTTP calls in components**: Use API services
4. **Don't mix server and client state**: Use React Query for server, Context for client
5. **Don't create large files**: Keep components under 300-400 lines
6. **Don't skip type definitions**: TypeScript is your friend
7. **Don't repeat components**: Extract to `shared/` or module `components/`

## Adding a New Feature

### Step 1: Create Module Structure

```bash
mkdir -p src/modules/my-feature/{pages,components,hooks,types}
```

### Step 2: Create Type Definitions

```tsx
// src/modules/my-feature/types/index.ts
export interface MyFeatureItem {
  id: string;
  name: string;
}
```

### Step 3: Create API Service

```tsx
// src/services/my-feature.api.ts
import { apiClient } from '@/services/api-client';

class MyFeatureApi {
  async getItems(): Promise<MyFeatureItem[]> {
    return apiClient.get('/my-feature');
  }
}
export const myFeatureApi = new MyFeatureApi();
```

### Step 4: Create Pages

```tsx
// src/modules/my-feature/pages/list.page.tsx
import { useQuery } from '@tanstack/react-query';
import { myFeatureApi } from '@/services/my-feature.api';

export const MyFeatureListPage = () => {
  const { data: items } = useQuery({
    queryKey: ['my-feature'],
    queryFn: () => myFeatureApi.getItems(),
  });

  return <div>{/* Render items */}</div>;
};
```

### Step 5: Add Route

```tsx
// src/routes/app-routes.tsx
import { ROUTES } from '@/routes/route-constants';

<Route path={ROUTES.MY_FEATURE.LIST} element={<MyFeatureListPage />} />
```

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Feedback SaaS
```

Access in code:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

## Dependencies

### Core
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **React Query (TanStack Query)**: Server state management
- **Axios**: HTTP client
- **TypeScript**: Type safety

### Styling
- **Tailwind CSS**: Utility-first CSS
- **Sass/SCSS**: Advanced styling (optional)

### UI Components
- **shadcn/radix**: Headless component library

## Troubleshooting

### Path alias not resolving?
1. Verify `tsconfig.json` has `"@/*": ["./src/*"]` in `paths`
2. Verify `vite.config.ts` has `alias: { "@": resolve(__dirname, "./src") }`
3. Restart the dev server: `npm run dev`
4. Clear cache: `rm -rf node_modules/.vite`

### Component not found?
Always use `@/` path aliases, never relative imports:
```tsx
// ❌ Wrong - relative paths
import { MyComponent } from 'components/my-component';
import { MyComponent } from '../../../shared/components/my-component';

// ✅ Correct - path aliases
import { MyComponent } from '@/shared/components/my-component';
```

### Route not working?
1. Check `ROUTES` constant for correct path
2. Verify component is lazy loaded in `app-routes.tsx`
3. Ensure route is protected if needed

### API call fails?
1. Check API Client interceptors
2. Verify token in localStorage
3. Check browser console for CORS errors

## Further Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [React Query Documentation](https://tanstack.com/query)
- [Axios Documentation](https://axios-http.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
