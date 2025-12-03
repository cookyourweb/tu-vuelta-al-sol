'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: 'es' | 'pt') => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLocale('es')}
        disabled={locale === 'es' || isPending}
        className={`px-3 py-1 rounded ${
          locale === 'es'
            ? 'bg-yellow-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
        } transition-colors disabled:opacity-50`}
      >
        ES
      </button>
      <button
        onClick={() => switchLocale('pt')}
        disabled={locale === 'pt' || isPending}
        className={`px-3 py-1 rounded ${
          locale === 'pt'
            ? 'bg-yellow-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
        } transition-colors disabled:opacity-50`}
      >
        PT
      </button>
    </div>
  );
}
