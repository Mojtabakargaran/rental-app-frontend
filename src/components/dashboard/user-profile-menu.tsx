'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Check, Globe, LogOut } from 'lucide-react';
import { AxiosError } from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { useUpdateLanguage } from '@/hooks/use-update-language';
import { useLogout } from '@/hooks/use-logout';
import type { DashboardUser, UpdateLanguageErrorResponse, LanguagePreference } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Set a cookie with the given name and value
 */
function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

interface UserProfileMenuProps {
  user: DashboardUser;
}

/**
 * User Profile Dropdown Menu Component - UC3.2 & UC3.4
 * Displays user info, language switcher, and logout option
 */
export function UserProfileMenu({ user }: UserProfileMenuProps) {
  const t = useTranslations('profile');
  const currentLocale = useLocale() as LanguagePreference;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { mutate: updateLanguage, error, isPending } = useUpdateLanguage();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Handle logout
  const handleLogout = () => {
    setOpen(false); // Close dropdown immediately
    
    logout(undefined, {
      onSuccess: (data) => {
        // Show success message
        if (data.warning) {
          console.warn('Logout warning:', data.warning);
        }
        
        // Clear all authentication and user data from frontend
        localStorage.removeItem('preferredLanguage');
        sessionStorage.clear();
        
        // Signal logout to other tabs via localStorage
        localStorage.setItem('logout-event', Date.now().toString());
        localStorage.removeItem('logout-event');
        
        // Redirect to login page with success message
        const currentLocale = localStorage.getItem('locale') || 'en';
        router.push(`/${currentLocale}/login?message=logged_out`);
      },
      onError: (_error) => {
        // Even on error, perform client-side logout
        console.error('Logout error:', _error);
        
        // Clear all client-side data
        localStorage.removeItem('preferredLanguage');
        sessionStorage.clear();
        
        // Signal logout to other tabs
        localStorage.setItem('logout-event', Date.now().toString());
        localStorage.removeItem('logout-event');
        
        // Redirect to login regardless of error
        const currentLocale = localStorage.getItem('locale') || 'en';
        router.push(`/${currentLocale}/login?message=logged_out`);
      },
    });
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: LanguagePreference) => {
    if (newLanguage === currentLocale) {
      return; // No change needed
    }

    // Optimistic UI update - change route immediately
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLanguage}`);
    
    // Update language preference in backend
    updateLanguage(
      { languagePreference: newLanguage },
      {
        onSuccess: () => {
          // Language updated successfully in backend
          setShowSuccessMessage(true);
          setRetryCount(0);
          setTimeout(() => setShowSuccessMessage(false), 3000);
          
          // Store the new language preference in localStorage and cookie
          localStorage.setItem('preferredLanguage', newLanguage);
          localStorage.setItem('locale', newLanguage);
          setCookie('preferredLanguage', newLanguage);
          
          // Navigate to new locale route and refresh
          router.push(newPathname);
          router.refresh();
          setOpen(false);
        },
        onError: (_error) => {
          // Store the new language preference for optimistic update in localStorage and cookie
          localStorage.setItem('preferredLanguage', newLanguage);
          localStorage.setItem('locale', newLanguage);
          setCookie('preferredLanguage', newLanguage);
          
          // Still navigate to maintain UI consistency (optimistic update)
          router.push(newPathname);
          router.refresh();
          
          // Retry logic for failed API call
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              updateLanguage({ languagePreference: newLanguage });
            }, 5000); // Retry after 5 seconds
          }
          
          setOpen(false);
        },
      }
    );
  };

  // Store language preference in localStorage and cookie for faster loading
  useEffect(() => {
    if (currentLocale) {
      localStorage.setItem('preferredLanguage', currentLocale);
      localStorage.setItem('locale', currentLocale);
      setCookie('preferredLanguage', currentLocale);
    }
  }, [currentLocale]);

  // Get error message if update failed
  const getErrorMessage = () => {
    if (!(error instanceof AxiosError)) return null;
    
    const errorData = error.response?.data as UpdateLanguageErrorResponse;
    const errorCode = errorData?.code;
    
    if (errorCode) {
      return t(`errors.${errorCode}`);
    }
    
    if (error.message.includes('Network')) {
      return t('errors.network');
    }
    
    return t('errors.updateFailed');
  };

  return (
    <>
      {/* Success notification */}
      {showSuccessMessage && (
        <div className="fixed top-4 end-4 z-50 animate-in slide-in-from-top-2">
          <Alert variant="success" className="shadow-lg">
            <Check className="size-4" />
            <p className="font-medium">{t('success.languageUpdated')}</p>
          </Alert>
        </div>
      )}

      {/* Error notification */}
      {error && !showSuccessMessage && (
        <div className="fixed top-4 end-4 z-50 animate-in slide-in-from-top-2">
          <Alert variant="destructive" className="shadow-lg">
            <p className="font-medium">{getErrorMessage()}</p>
          </Alert>
        </div>
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isPending || isLoggingOut}
          >
            <span className="font-medium">{user.fullName}</span>
            <ChevronDown className={cn(
              'size-4 transition-transform duration-200',
              open && 'rotate-180'
            )} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {/* User Info Section */}
          <DropdownMenuLabel>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-xs font-normal text-gray-500">{t('menu.role')}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Language Selector */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="size-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {t('menu.languageLabel')}
              </span>
            </div>
            <DropdownMenuRadioGroup
              value={currentLocale}
              onValueChange={(value: string) => handleLanguageChange(value as LanguagePreference)}
            >
              <DropdownMenuRadioItem value="en" disabled={isPending}>
                <span className="flex-1">{t('language.en')}</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="fa" disabled={isPending}>
                <span className="flex-1">{t('language.fa')}</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </div>

          <DropdownMenuSeparator />

          {/* Logout Option - UC3.4 */}
          <DropdownMenuItem 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="size-4 me-2" />
            <span>{isLoggingOut ? t('logout.loggingOut') : t('menu.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
