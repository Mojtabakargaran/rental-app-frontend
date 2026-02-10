@ -1,132 +0,0 @@
# Frontend - Rental Management System

> Next.js 14+ frontend implementation for Phase 1 (Registration, Email Verification), Phase 2 (User Login), Phase 3 (Dashboard Landing Page), Phase 4 (User Management: Create User, User List, Assign and Modify Roles, Edit User Profile, Deactivate and Reactivate User Accounts, First-Time Login and Password Change), Phase 5 (Equipment Categories: Create Category, View Categories, Update Category, Archive Category), and Phase 6 (Equipment Inventory: Add Equipment, Browse and Search Equipment, View Equipment Details, Edit Equipment Information, Manage Equipment Status and Lifecycle)

## Technology Stack

- **Framework:** Next.js 14.2+ with App Router
- **Language:** TypeScript 5.4+ (strict mode)
- **Styling:** TailwindCSS 3.4+ with RTL support
- **UI Components:** shadcn/ui with Radix UI primitives
- **Forms:** React Hook Form 7.51+ with Zod validation
- **State Management:** TanStack Query 5.28+ (server state), React Context (client state)
- **HTTP Client:** Axios 1.6.8+
- **Internationalization:** next-intl 3.11+
- **Icons:** Lucide React

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Locale-based routing
│   │   │   ├── layout.tsx        # Root layout with i18n
│   │   │   ├── page.tsx          # Home page (redirects to register)
│   │   │   ├── register/
│   │   │   │   └── page.tsx      # Registration page
│   │   │   ├── resend-verification/
│   │   │   │   └── page.tsx      # Resend verification page
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx      # Email verification page
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login page
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx      # Forgot password page
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx      # Reset password page
│   │   │   ├── change-password-first-login/
│   │   │   │   └── page.tsx      # Change password first login page (P4UC06)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Dashboard landing page
│   │   │   ├── user-management/
│   │   │   │   └── create/
│   │   │   │       └── page.tsx  # Create user page
│   │   │   ├── equipment-categories/
│   │   │   │   ├── page.tsx      # Equipment categories list (P5UC02)
│   │   │   │   └── create/
│   │   │   │       └── page.tsx  # Create equipment category page (P5UC01)
│   │   │   └── equipment/
│   │   │       ├── page.tsx      # Equipment inventory list (P6UC02)
│   │   │       ├── create/
│   │   │       │   └── page.tsx  # Add equipment to inventory page (P6UC01)
│   │   │       └── [equipmentId]/
│   │   │           ├── page.tsx  # View equipment details page (P6UC03)
│   │   │           └── edit/
│   │   │               └── page.tsx # Edit equipment information page (P6UC04)
│   │   └── globals.css           # Global styles with Tailwind
│   ├── components/
│   │   ├── ui/                   # Reusable UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dropdown-menu.tsx # Dropdown menu components
│   │   │   ├── badge.tsx         # Badge component for status/role indicators
│   │   │   ├── skeleton.tsx      # Skeleton loading component
│   │   │   ├── dialog.tsx        # Modal dialog components
│   │   │   ├── textarea.tsx      # Textarea component
│   │   │   └── radio-group.tsx   # Radio group components
│   │   ├── forms/
│   │   │   ├── register-form.tsx # Registration form component
│   │   │   ├── resend-verification-form.tsx # Resend verification form
│   │   │   ├── login-form.tsx    # Login form component
│   │   │   ├── change-password-first-login-form.tsx # Change password first login form (P4UC06)
│   │   │   ├── create-user-form.tsx # Create user form component
│   │   │   ├── create-category-form.tsx # Create equipment category form (P5UC01)
│   │   │   ├── create-equipment-form.tsx # Create equipment form (P6UC01)
│   │   │   └── edit-equipment-form.tsx # Edit equipment form (P6UC04)
│   │   ├── dashboard/
│   │   │   ├── company-info-card.tsx # Company information display
│   │   │   ├── dashboard-metrics.tsx # Dashboard metrics (coming soon)
│   │   │   └── user-profile-menu.tsx # User profile dropdown with language switcher
│   │   ├── user-management/
│   │   │   ├── user-list.tsx     # User list with search and filters
│   │   │   ├── user-list-table.tsx # User table component
│   │   │   ├── user-list-pagination.tsx # Pagination controls
│   │   │   ├── user-list-filters.tsx # Filter dropdowns
│   │   │   ├── user-list-empty.tsx # Empty state component
│   │   │   ├── user-details-modal.tsx # User details modal
│   │   │   ├── change-role-dialog.tsx # Change user role dialog (P4UC03)
│   │   │   ├── edit-user-profile-dialog.tsx # Edit user profile dialog (P4UC04)
│   │   │   ├── deactivate-user-dialog.tsx # Deactivate user dialog (P4UC05)
│   │   │   └── reactivate-user-dialog.tsx # Reactivate user dialog (P4UC05)
│   │   ├── equipment-categories/
│   │   │   ├── categories-list.tsx # Categories list with search and filters (P5UC02)
│   │   │   ├── category-filters.tsx # Search and filter controls (P5UC02)
│   │   │   ├── category-tree.tsx # Hierarchical tree display (P5UC02, P5UC03, P5UC04)
│   │   │   ├── category-pagination.tsx # Pagination controls (P5UC02)
│   │   │   ├── category-empty-state.tsx # Empty state display (P5UC02)
│   │   │   ├── category-skeleton.tsx # Loading skeleton (P5UC02)
│   │   │   ├── edit-category-dialog.tsx # Edit category dialog (P5UC03)
│   │   │   ├── deactivate-category-dialog.tsx # Deactivate category dialog (P5UC04)
│   │   │   ├── reactivate-category-dialog.tsx # Reactivate category dialog (P5UC04)
│   │   │   ├── delete-category-dialog.tsx # Delete category dialog (P5UC04)
│   │   │   └── index.ts
│   │   ├── equipment/
│   │   │   ├── equipment-list.tsx # Equipment list with search and filters (P6UC02)
│   │   │   ├── equipment-filters.tsx # Search and filter controls (P6UC02)
│   │   │   ├── equipment-table.tsx # Equipment table display (P6UC02, P6UC03)
│   │   │   ├── equipment-pagination.tsx # Pagination controls (P6UC02)
│   │   │   ├── equipment-empty-state.tsx # Empty state display (P6UC02)
│   │   │   ├── equipment-skeleton.tsx # Loading skeleton (P6UC02)
│   │   │   ├── equipment-details.tsx # Equipment details display (P6UC03, P6UC05)
│   │   │   ├── equipment-details-skeleton.tsx # Details loading skeleton (P6UC03)
│   │   │   ├── change-status-dialog.tsx # Change equipment status dialog (P6UC05)
│   │   │   ├── archive-equipment-dialog.tsx # Archive equipment dialog (P6UC05)
│   │   │   ├── delete-equipment-permanently-dialog.tsx # Delete equipment permanently dialog (P6UC05)
│   │   │   └── index.ts
│   │   └── error-boundary.tsx    # Error boundary component
│   ├── hooks/
│   │   ├── use-register.ts       # Registration mutation hook
│   │   ├── use-resend-verification.ts # Resend verification mutation hook
│   │   ├── use-verify-email.ts   # Email verification query hook
│   │   ├── use-login.ts          # Login mutation hook
│   │   ├── use-forgot-password.ts # Forgot password mutation hook
│   │   ├── use-validate-reset-token.ts # Reset token validation query hook
│   │   ├── use-reset-password.ts # Reset password mutation hook
│   │   ├── use-dashboard.ts      # Dashboard data query hook
│   │   ├── use-update-language.ts # Language preference mutation hook
│   │   ├── use-csrf-token.ts     # CSRF token management hook
│   │   ├── use-get-roles.ts      # Get roles query hook
│   │   ├── use-create-user.ts    # Create user mutation hook
│   │   ├── use-get-users.ts      # Get user list query hook
│   │   ├── use-get-user-details.ts # Get user details query hook
│   │   ├── use-update-user-role.ts # Update user role mutation hook (P4UC03)
│   │   ├── use-update-user-profile.ts # Update user profile mutation hook (P4UC04)
│   │   ├── use-deactivate-user.ts # Deactivate user mutation hook (P4UC05)
│   │   ├── use-change-password-first-login.ts # Change password first login mutation hook (P4UC06)
│   │   ├── use-create-category.ts # Create equipment category mutation hook (P5UC01)
│   │   ├── use-get-categories-list.ts # Get categories list query hook (P5UC01)
│   │   ├── use-get-categories.ts # Get paginated categories query hook (P5UC02)
│   │   ├── use-update-category.ts # Update equipment category mutation hook (P5UC03)
│   │   ├── use-deactivate-category.ts # Deactivate equipment category mutation hook (P5UC04)
│   │   ├── use-reactivate-category.ts # Reactivate equipment category mutation hook (P5UC04)
│   │   ├── use-delete-category.ts # Delete equipment category mutation hook (P5UC04)
│   │   ├── use-create-equipment.ts # Create equipment mutation hook (P6UC01)
│   │   ├── use-list-equipment.ts # List equipment query hook (P6UC02)
│   │   ├── use-get-equipment-details.ts # Get equipment details query hook (P6UC03)
│   │   ├── use-update-equipment.ts # Update equipment mutation hook (P6UC04)
│   │   ├── use-update-equipment-status.ts # Update equipment status mutation hook (P6UC05)
│   │   └── use-delete-equipment.ts # Soft and permanent delete equipment mutation hooks (P6UC05)
│   ├── lib/
│   │   ├── api/
│   │   │   └── axios.config.ts   # Axios instance with interceptors
│   │   ├── providers/
│   │   │   ├── query-provider.tsx    # TanStack Query provider
│   │   │   └── intl-provider.tsx     # i18n provider
│   │   └── utils.ts              # Utility functions (cn, etc.)
│   ├── schemas/
│   │   ├── auth.schema.ts        # Zod validation schemas (register, resend verification, login, forgot password, reset password, change password first login)
│   │   ├── user.schema.ts        # User validation schemas (language preference)
│   │   ├── user-management.schema.ts # User management validation schemas (create user)
│   │   ├── equipment.schema.ts   # Equipment validation schemas (create category)
│   │   ├── archive-category.schema.ts # Archive category validation schema (P5UC04)
│   │   ├── create-equipment.schema.ts # Create equipment validation schema (P6UC01)
│   │   └── edit-equipment.schema.ts # Edit equipment validation schema (P6UC04)
│   │   ├── archive-category.schema.ts # Archive category validation schema (deactivate category reason)
│   │   ├── create-equipment.schema.ts # Create equipment validation schema (P6UC01)
│   │   └── index.ts
│   ├── services/
│   │   └── api/
│   │       ├── auth.service.ts   # Auth API service (register, resend verification, verify email, login, forgot password, reset password, change password first login)
│   │       ├── dashboard.service.ts # Dashboard API service (get dashboard data)
│   │       ├── user.service.ts   # User API service (update language preference)
│   │       ├── equipment.service.ts # Equipment API service (get categories list, get categories, create category, update category, deactivate category, reactivate category, delete category, create equipment)
│   │       ├── user-management.service.ts # User management API service (get roles, create user, get users, get user details)
│   │       └── index.ts
│   ├── types/
│   │   ├── auth.types.ts         # Auth type definitions
│   │   ├── dashboard.types.ts    # Dashboard type definitions
│   │   ├── equipment.types.ts    # Equipment type definitions
│   │   ├── user.types.ts         # User type definitions
│   │   ├── user-management.types.ts # User management type definitions
│   │   └── index.ts
│   ├── utils/
│   │   └── error.util.ts         # Error handling utilities
│   ├── i18n.ts                   # i18n configuration (auto-loads locale files)
│   └── middleware.ts             # Next.js middleware for locale
├── public/
│   └── locales/                  # Translation files (feature-based)
│   │   ├── README.md             # Quick reference for translations
│   │   ├── en/                   # English translations
│   │   │   ├── register.json     # Registration, resend verification & verify email features
│   │   │   ├── login.json        # Login feature
│   │   │   ├── forgot-password.json # Forgot password & reset password features
│   │   │   ├── dashboard.json    # Dashboard feature
│   │   │   ├── profile.json      # User profile menu & language switching
│   │   │   ├── user-management.json # User management features
│   │   │   ├── equipment.json    # Equipment categories features (P5UC01)
│   │   │   ├── shared.json       # Common translations
│   │   │   └── [feature].json    # Future features
│   │   └── fa/                   # Persian translations
│   │       ├── register.json     # Registration, resend verification & verify email features
│   │       ├── login.json        # Login feature
│   │   │   ├── forgot-password.json # Forgot password & reset password features
│   │   │   ├── dashboard.json    # Dashboard feature
│   │   │   ├── profile.json      # User profile menu & language switching
│   │   │   ├── user-management.json # User management features
│   │   │   ├── equipment.json    # Equipment categories features (P5UC01)
│   │   │   ├── shared.json       # Common translations
│   │   │   └── [feature].json    # Future features
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rental Management System
NEXT_PUBLIC_DEFAULT_LOCALE=en
```