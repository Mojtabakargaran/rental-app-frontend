'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  UserCircle,
  Calendar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Navigation menu item type
 */
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  disabled: boolean;
  phase?: number;
}

/**
 * Sidebar Navigation Component - UC3.3
 * Displays navigation menu with active states, disabled items, and responsive behavior
 */
export function SidebarNavigation() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Load sidebar state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to local storage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      icon: LayoutDashboard,
      href: '/dashboard',
      disabled: false,
    },
    {
      id: 'userManagement',
      label: t('navigation.userManagement'),
      icon: Users,
      href: '/user-management',
      disabled: false,
    },
    {
      id: 'equipmentCategories',
      label: t('navigation.equipmentCategories'),
      icon: FolderTree,
      href: '/equipment-categories',
      disabled: false,
    },
    {
      id: 'equipmentInventory',
      label: t('navigation.equipmentInventory'),
      icon: Package,
      href: '/equipment-inventory',
      disabled: false,
      phase: 6,
    },
    {
      id: 'customers',
      label: t('navigation.customers'),
      icon: UserCircle,
      href: '/customers',
      disabled: true,
      phase: 7,
    },
    {
      id: 'bookings',
      label: t('navigation.bookings'),
      icon: Calendar,
      href: '/bookings',
      disabled: true,
      phase: 9,
    },
  ];

  // Check if current path is active
  const isActive = (href: string) => {
    // Extract locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|fa)/, '');
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/');
  };

  // Render navigation item
  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const itemContent = (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          active && 'bg-blue-50 text-blue-600 font-medium',
          !active && !item.disabled && 'text-gray-700 hover:bg-gray-100',
          item.disabled && 'text-gray-400 cursor-not-allowed opacity-60',
          isCollapsed && 'justify-center'
        )}
        onMouseEnter={() => item.disabled && setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Icon className={cn('size-5 flex-shrink-0', active && 'text-blue-600')} />
        {!isCollapsed && <span className="flex-1 text-sm">{item.label}</span>}
        
        {/* Tooltip for disabled items */}
        {item.disabled && hoveredItem === item.id && (
          <div className="absolute start-full ms-2 z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
            {t('navigation.comingSoonTooltip', { phase: item.phase })}
            <div className="absolute top-1/2 -translate-y-1/2 end-full w-0 h-0 border-t-4 border-b-4 border-e-4 border-transparent border-e-gray-900 rtl:end-auto rtl:start-full rtl:border-e-0 rtl:border-s-4 rtl:border-s-gray-900" />
          </div>
        )}
      </div>
    );

    if (item.disabled) {
      return (
        <div key={item.id} className="relative">
          {itemContent}
        </div>
      );
    }

    return (
      <Link key={item.id} href={item.href} className="relative block">
        {itemContent}
      </Link>
    );
  };

  // Sidebar content
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-e border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-gray-900">{t('sidebar.appName')}</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex size-8"
          aria-label={isCollapsed ? t('sidebar.expandLabel') : t('sidebar.collapseLabel')}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4 rtl:rotate-180" />
          ) : (
            <ChevronLeft className="size-4 rtl:rotate-180" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden size-8"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(renderNavItem)}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 start-4 z-40 bg-white shadow-md"
        aria-label={t('sidebar.toggleLabel')}
      >
        <Menu className="size-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden lg:block fixed top-0 start-0 h-screen z-30 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 start-0 h-screen w-64 z-50 transition-transform duration-300',
          isMobileOpen ? 'translate-x-0 rtl:-translate-x-0' : '-translate-x-full rtl:translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
