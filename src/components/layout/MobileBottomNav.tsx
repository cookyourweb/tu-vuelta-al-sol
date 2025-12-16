// src/components/layout/MobileBottomNav.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Star, Sun, Calendar, Settings } from 'lucide-react';

const baseNavItems = [
  {
    href: '/birth-data',
    label: 'Nacimiento',
    icon: Sparkles,
    shortLabel: 'Nacimiento'
  },
  {
    href: '/natal-chart',
    label: 'Natal',
    icon: Star,
    shortLabel: 'Natal'
  },
  {
    href: '/solar-return',
    label: 'R.Solar',
    icon: Sun,
    shortLabel: 'R.Solar'
  },
  {
    href: '/agenda',
    label: 'Agenda',
    icon: Calendar,
    shortLabel: 'Agenda'
  }
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    try {
      // Get Firebase ID token for authentication
      const token = await user.getIdToken();

      const res = await fetch(`/api/users?uid=${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const userData = await res.json();
        setUserRole(userData.role);
      }
    } catch (error) {
      console.log('Error obteniendo rol del usuario:', error);
    }
  };

  // Build nav items based on user role
  const navItems = userRole === 'admin'
    ? [
        {
          href: '/admin',
          label: 'Admin',
          icon: Settings,
          shortLabel: 'Admin'
        },
        ...baseNavItems
      ]
    : baseNavItems;

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      handleSwipe(isLeftSwipe ? 'left' : 'right');
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = navItems.findIndex(item => isActiveRoute(item.href));

    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'left') {
      // Swipe left: go to next item (right in navigation)
      nextIndex = currentIndex + 1;
    } else {
      // Swipe right: go to previous item (left in navigation)
      nextIndex = currentIndex - 1;
    }

    // Wrap around if needed
    if (nextIndex < 0) {
      nextIndex = navItems.length - 1;
    } else if (nextIndex >= navItems.length) {
      nextIndex = 0;
    }

    const nextItem = navItems[nextIndex];
    if (nextItem) {
      router.push(nextItem.href);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-purple-900/95 backdrop-blur-lg border-t border-purple-700/50 shadow-2xl">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-300 relative ${
                isActive 
                  ? 'text-yellow-400' 
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              {/* Indicador superior para página activa */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-b-full"></div>
              )}
              
              {/* Icono */}
              <div className={`relative transition-all duration-300 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <IconComponent className={`w-7 h-7 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''
                }`} />

                {/* Resplandor para activo */}
                {isActive && (
                  <div className="absolute inset-0 w-7 h-7 bg-yellow-400 rounded-full opacity-20 blur-md -z-10"></div>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'text-yellow-400' : 'text-purple-200'
              }`}>
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}