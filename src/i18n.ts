import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import type { AbstractIntlMessages } from 'next-intl';

// Supported locales
export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];

/**
 * Dynamically load and merge all JSON translation files for a given locale
 * This allows for a scalable, feature-based translation structure
 */
async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  const messagesDir = path.join(process.cwd(), 'public', 'locales', locale);
  
  // Check if the locale directory exists
  if (!fs.existsSync(messagesDir)) {
    console.warn(`Locale directory not found: ${messagesDir}`);
    return {};
  }

  const messages: AbstractIntlMessages = {};
  
  // Read all JSON files in the locale directory
  const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(messagesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const namespace = file.replace('.json', '');
    
    try {
      messages[namespace] = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
    }
  }
  
  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the locale from the request
  const locale = await requestLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
