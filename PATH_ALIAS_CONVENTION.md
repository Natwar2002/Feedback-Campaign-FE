# Path Alias Strict Convention Guide

## Overview

This project uses **strict path aliases** for all imports. This ensures:
- ✅ Consistent imports across the entire codebase
- ✅ Easier refactoring and moving files
- ✅ Better code readability
- ✅ No relative path confusion (`../../../`)

## Path Alias Configuration

### TypeScript Config (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Config (`vite.config.ts`)
```typescript
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    tsconfigPaths: true,
  },
});
```

## Import Rules

### ✅ DO: Use `@/` for all imports

```typescript
// ✅ Correct - from anywhere in the app
import { organizationApi } from '@/services/organization.api';
import { ROUTES } from '@/routes/route-constants';
import { useAuth } from '@/store/auth/auth.context';
import { Button } from '@/shared/ui/button';
import { Organization } from '@/modules/organization/types';
```

### ❌ DON'T: Use relative paths

```typescript
// ❌ Wrong - relative paths
import { organizationApi } from '../../../services/organization.api';
import { ROUTES } from '../../../routes/route-constants';
import { useAuth } from './auth.context';

// ❌ Wrong - mixed imports
import { organizationApi } from '@/services/organization.api';
import { SomeComponent } from '../components/some-component'; // ← Inconsistent!
```

## Import Patterns by Location

### Imports in Module Pages
**File**: `src/modules/organization/pages/org-list.page.tsx`

```typescript
import { organizationApi } from '@/services/organization.api';      // Services
import { ROUTES } from '@/routes/route-constants';                 // Routes
import { useQuery } from '@tanstack/react-query';                  // External
import { Organization } from '@/modules/organization/types';       // Local types
import { OrgCard } from '@/modules/organization/components/org-card'; // Local components
```

### Imports in Module Components
**File**: `src/modules/organization/components/org-form.tsx`

```typescript
import { organizationApi } from '@/services/organization.api';     // Services
import { Organization } from '@/modules/organization/types';       // Local types
import { Button } from '@/shared/ui/button';                       // Shared UI
import { useAsync } from '@/shared/hooks/use-async';               // Shared hooks
```

### Imports in Hooks
**File**: `src/shared/hooks/use-auth.ts`

```typescript
import { useAuth as useAuthContext } from '@/store/auth/auth.context'; // Store
import { Organization } from '@/modules/organization/types';            // Types
```

### Imports in Services
**File**: `src/services/organization.api.ts`

```typescript
import { apiClient } from '@/services/api-client';                     // Services
import { Organization } from '@/modules/organization/types';           // Types
```

### Imports in Routes
**File**: `src/routes/app-routes.tsx`

```typescript
import { ROUTES } from '@/routes/route-constants';                      // Routes
import { ProtectedRoute } from '@/routes/route-guards';                 // Routes

// Lazy import patterns
const LoginPage = React.lazy(() =>
  import('@/modules/auth/pages/login.page').then((m) => ({ default: m.LoginPage }))
);

const DashboardLayout = React.lazy(() =>
  import('@/layouts/dashboard.layout').then((m) => ({ default: m.DashboardLayout }))
);
```

### Imports in Providers
**File**: `src/providers/app-provider.tsx`

```typescript
import { QueryProvider } from '@/providers/query-provider';            // Providers
import { RouterProvider } from '@/providers/router-provider';          // Providers
```

## Directory Structure & Import Paths

```
src/
├── main.tsx                      → import '@/main'
├── App.tsx                       → import '@/App'
│
├── providers/
│   ├── app-provider.tsx          → import { AppProvider } from '@/providers/app-provider'
│   ├── query-provider.tsx        → import { QueryProvider } from '@/providers/query-provider'
│   └── router-provider.tsx       → import { RouterProvider } from '@/providers/router-provider'
│
├── routes/
│   ├── app-routes.tsx            → import { AppRoutes } from '@/routes/app-routes'
│   ├── route-constants.ts        → import { ROUTES } from '@/routes/route-constants'
│   └── route-guards.tsx          → import { ProtectedRoute } from '@/routes/route-guards'
│
├── layouts/
│   ├── dashboard.layout.tsx      → import { DashboardLayout } from '@/layouts/dashboard.layout'
│   └── auth.layout.tsx           → import { AuthLayout } from '@/layouts/auth.layout'
│
├── modules/
│   ├── organization/
│   │   ├── pages/
│   │   │   ├── org-list.page.tsx → import { OrgListPage } from '@/modules/organization/pages/org-list.page'
│   │   │   └── org-detail.page.tsx → import { OrgDetailPage } from '@/modules/organization/pages/org-detail.page'
│   │   ├── components/
│   │   │   └── org-card.tsx      → import { OrgCard } from '@/modules/organization/components/org-card'
│   │   ├── hooks/
│   │   │   └── use-org.ts        → import { useOrg } from '@/modules/organization/hooks/use-org'
│   │   └── types/
│   │       └── index.ts          → import { Organization } from '@/modules/organization/types'
│   │
│   ├── auth/pages/login.page.tsx → import { LoginPage } from '@/modules/auth/pages/login.page'
│   └── [other modules...]
│
├── services/
│   ├── api-client.ts             → import { apiClient } from '@/services/api-client'
│   ├── organization.api.ts       → import { organizationApi } from '@/services/organization.api'
│   └── workspace.api.ts          → import { workspaceApi } from '@/services/workspace.api'
│
├── store/
│   ├── auth/
│   │   └── auth.context.tsx      → import { useAuth } from '@/store/auth/auth.context'
│   └── organization/
│       └── org.context.tsx       → import { useOrganization } from '@/store/organization/org.context'
│
├── shared/
│   ├── ui/
│   │   └── button.tsx            → import { Button } from '@/shared/ui/button'
│   ├── components/
│   │   └── header.tsx            → import { Header } from '@/shared/components/header'
│   ├── hooks/
│   │   └── use-async.ts          → import { useAsync } from '@/shared/hooks/use-async'
│   ├── utils/
│   │   └── format.ts             → import { formatDate } from '@/shared/utils/format'
│   └── constants/
│       └── api.ts                → import { API_URL } from '@/shared/constants/api'
│
├── styles/
│   └── globals.css               → import '@/styles/globals.css'
│
└── types/
    └── index.ts                  → import { ApiResponse } from '@/types'
```

## Linting & Enforcement

### ESLint Rule (Recommended)

Add to `.eslintrc.json`:

```json
{
  "rules": {
    "import/no-relative-parent-imports": "error",
    "import/no-relative-imports": ["error", { "allow": "sibling" }]
  }
}
```

Or use `no-restricted-imports`:

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["../"]
      }
    ]
  }
}
```

### TypeScript Path Validation

The `tsconfig.json` and `vite.config.ts` are configured to enforce path aliases at compile time.

## Common Mistakes & Fixes

### Mistake 1: Mixed Relative and Absolute Paths

```typescript
// ❌ Wrong
import { organizationApi } from '@/services/organization.api';
import { OrgCard } from '../components/org-card'; // ← Relative!

// ✅ Correct
import { organizationApi } from '@/services/organization.api';
import { OrgCard } from '@/modules/organization/components/org-card';
```

### Mistake 2: Wrong Path in Lazy Imports

```typescript
// ❌ Wrong
const OrgList = React.lazy(() =>
  import('../modules/organization/pages/org-list.page')
);

// ✅ Correct
const OrgList = React.lazy(() =>
  import('@/modules/organization/pages/org-list.page')
);
```

### Mistake 3: Cross-Module Imports (Should be Avoided)

```typescript
// ❌ Wrong - importing from another module's private components
import { OrgInternalComponent } from '@/modules/organization/components/internal';

// ✅ Correct - only import from public exports
import { Organization } from '@/modules/organization/types';
import { organizationApi } from '@/services/organization.api';
```

### Mistake 4: Forgetting to Export

```typescript
// ❌ File: src/modules/organization/types/index.ts doesn't have export
export interface Organization { /* ... */ }
// But being imported as:
import { Organization } from '@/modules/organization/types';

// ✅ Make sure exports are available
export interface Organization { /* ... */ }
export type MyType = string;
```

## Migration Guide

If you have existing code with relative imports, convert them:

```bash
# Pattern to find all relative imports
grep -r "from ['\"].*\.\..*['\"]" src/

# Replace pattern (example with sed):
sed -i "s|from ['\"]../../../services/\([^'\"]*\)['\"]|from '@/services/\1'|g" src/**/*.tsx
```

## FAQ

**Q: Can I use `~` alias like in some projects?**
A: No, this project strictly uses `@/`. This is the modern standard and matches TypeScript defaults.

**Q: What about monorepo workspaces?**
A: If adding workspaces, create separate path aliases (e.g., `@ui/*`, `@api/*`).

**Q: How do I import from node_modules?**
A: No change needed! External imports don't use `@/`:
```typescript
import React from 'react';                    // ← External
import { Button } from '@/shared/ui/button'; // ← Internal
```

**Q: Can I have relative imports within same directory?**
A: No, still use `@/` for consistency:
```typescript
// File: src/services/organization.api.ts
// ❌ Wrong: import { apiClient } from './api-client'
// ✅ Correct: import { apiClient } from '@/services/api-client'
```

## Pre-commit Hooks

Consider adding a pre-commit hook to prevent relative imports:

```bash
#!/bin/bash
# .husky/pre-commit

# Check for relative imports in TypeScript files
if git diff --cached --name-only | grep -E '\.(ts|tsx)$' | xargs grep -l "from ['\"]\.\."; then
  echo "❌ Error: Relative imports detected. Use @/ path aliases instead."
  exit 1
fi
```
