'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LanguagePreference } from '@/types';

/**
 * Set a cookie with the given name and value
 */
function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

interface LanguageToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

/**
 * Language Toggle Component
 * Simple language switcher for unauthenticated pages (login, register, etc.)
 */
export function LanguageToggle({ 
  variant = 'outline', 
  size = 'default',
  showLabel = true 
}: LanguageToggleProps) {
  const currentLocale = useLocale() as LanguagePreference;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLanguage: LanguagePreference) => {
    if (newLanguage === currentLocale) {
      return;
    }

    // Store language preference
    localStorage.setItem('preferredLanguage', newLanguage);
    localStorage.setItem('locale', newLanguage);
    setCookie('preferredLanguage', newLanguage);

    // Navigate to new locale
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLanguage}`);
    router.push(newPathname);
    router.refresh();
  };

  const languageLabels = {
    en: 'English',
    fa: 'فارسی',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="size-4" />
          {showLabel && <span>{languageLabels[currentLocale]}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={(value: string) => handleLanguageChange(value as LanguagePreference)}
        >
          <DropdownMenuRadioItem value="en">
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fa">
            فارسی
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
