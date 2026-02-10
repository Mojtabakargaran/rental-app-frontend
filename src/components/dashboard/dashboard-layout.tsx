'use client';

import { SidebarNavigation } from './sidebar-navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Alert } from '@/components/ui/alert';

/**
 * Dashboard Layout Component - UC3.3 & UC3.4
 * Wraps dashboard content with sidebar navigation
 * Handles multi-tab logout and session expiration
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMultiTabLogoutMessage, setShowMultiTabLogoutMessage] = useState(false);
  const [showSessionExpiredMessage, setShowSessionExpiredMessage] = useState(false);
  const router = useRouter();
  const t = useTranslations('profile');
  const locale = useLocale();

  // Sync with sidebar state from local storage
  useEffect(() => {
    const updateCollapsedState = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    };

    // Initial load
    updateCollapsedState();

    // Listen for storage changes (from sidebar component)
    window.addEventListener('storage', updateCollapsedState);

    // Poll for changes since storage event doesn't fire in same tab
    const interval = setInterval(updateCollapsedState, 100);

    return () => {
      window.removeEventListener('storage', updateCollapsedState);
      clearInterval(interval);
    };
  }, []);

  // Multi-tab logout and session expiration handler (UC3.4 AF5 & AF6)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Handle logout from another tab (UC3.4 AF6)
      if (e.key === 'logout-event') {
        setShowMultiTabLogoutMessage(true);
        
        // Clear all client data
        sessionStorage.clear();
        localStorage.removeItem('preferredLanguage');
        
        // Redirect to login after showing message
        setTimeout(() => {
          router.push(`/${locale}/login?message=multi_tab_logout`);
        }, 2000);
      }

      // Handle session expiration from another tab/request (UC3.4 AF4 & AF5)
      if (e.key === 'session-expired') {
        setShowSessionExpiredMessage(true);
        
        // Clear all client data
        sessionStorage.clear();
        localStorage.removeItem('preferredLanguage');
        
        // Redirect to login after showing message
        setTimeout(() => {
          router.push(`/${locale}/login?session_expired=true`);
        }, 3000);
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Multi-tab logout notification */}
      {showMultiTabLogoutMessage && (
        <div className="fixed top-4 start-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2">
          <Alert className="shadow-lg">
            <p className="font-medium">{t('logout.multiTabLogout')}</p>
          </Alert>
        </div>
      )}

      {/* Session expired notification */}
      {showSessionExpiredMessage && (
        <div className="fixed top-4 start-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2">
          <Alert variant="destructive" className="shadow-lg">
            <p className="font-medium">{t('logout.sessionExpiredTitle')}</p>
            <p className="text-sm mt-1">{t('logout.sessionExpired')}</p>
          </Alert>
        </div>
      )}

      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300',
          'lg:ps-64', // Default padding for expanded sidebar
          isCollapsed && 'lg:ps-20' // Reduced padding for collapsed sidebar
        )}
      >
        {children}
      </div>
    </div>
  );
}
