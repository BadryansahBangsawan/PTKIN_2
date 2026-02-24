'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useModalContext } from '@/contexts/modal-context';

const navItems = [
  { name: 'Beranda', href: '/' },
  { name: 'Program Studi', href: '/program-studi' },
  { name: 'Helpdesk', href: 'https://sapa.ptkin.ac.id/', external: true },
];

type NavbarAuthUser = {
  fullName: string;
  displayName: string;
  initials: string;
};

const NAVBAR_NAME_MAX_LENGTH = 18;

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return '';
  const row = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`));
  if (!row) return '';
  const value = row.slice(name.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getInitialsFromName(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return 'U';
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function readNavbarAuthUser(): NavbarAuthUser | null {
  const isLoggedIn = getCookieValue('umptkin_login');
  if (!isLoggedIn) return null;

  const rawName = getCookieValue('umptkin_name').trim();
  const rawUser = getCookieValue('umptkin_user').trim();
  const fullName = rawName || rawUser;
  if (!fullName) return null;

  const initials = getInitialsFromName(fullName);
  const displayName =
    fullName.length > NAVBAR_NAME_MAX_LENGTH ? initials : fullName;

  return { fullName, displayName, initials };
}

export default function Header2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<NavbarAuthUser | null>(null);
  const { setShowRegisterModal, setShowLoginModal } = useModalContext();

  const handleLogout = () => {
    if (typeof document === 'undefined') return;
    document.cookie = 'umptkin_login=; path=/; max-age=0';
    document.cookie = 'umptkin_user=; path=/; max-age=0';
    document.cookie = 'umptkin_name=; path=/; max-age=0';
    setAuthUser(null);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event('umptkin-auth-changed'));
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(readNavbarAuthUser());
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        syncAuthUser();
      }
    };

    syncAuthUser();
    window.addEventListener('focus', syncAuthUser);
    window.addEventListener('umptkin-auth-changed', syncAuthUser as EventListener);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', syncAuthUser);
      window.removeEventListener('umptkin-auth-changed', syncAuthUser as EventListener);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-border/50 bg-background/80 border-b shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                prefetch={false}
                href="/"
                className="flex items-center space-x-3"
              >
                <img src="/Logo.svg" alt="Logo" className="h-8 w-auto" />
              </Link>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    prefetch={false}
                    href={item.href as any}
                    target={(item as any).external ? '_blank' : undefined}
                    rel={(item as any).external ? 'noopener noreferrer' : undefined}
                    className="text-foreground/80 hover:text-foreground relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="bg-muted absolute inset-0 rounded-lg"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              variants={itemVariants}
            >
              {authUser ? (
                <div className="group relative">
                  <div
                    title={authUser.fullName}
                    className="border-border/60 bg-background/80 inline-flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm backdrop-blur-sm"
                  >
                    <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                      {authUser.initials}
                    </span>
                    <span className="max-w-[180px] truncate text-sm font-medium text-foreground">
                      {authUser.displayName}
                    </span>
                  </div>

                  <div className="pointer-events-none absolute right-0 top-full z-50 pt-2 opacity-0 translate-y-1 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0">
                    <div className="border-border bg-background min-w-56 overflow-hidden rounded-xl border shadow-lg">
                      <div className="border-border/70 border-b px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Profil
                        </p>
                        <p className="mt-1 truncate text-sm font-medium text-foreground" title={authUser.fullName}>
                          {authUser.fullName}
                        </p>
                      </div>
                      <Link
                        prefetch={false}
                        href="/profil"
                        className="hover:bg-muted flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                      >
                        Profil
                      </Link>
                      <Link
                        prefetch={false}
                        href="/form-pendaftaran"
                        className="hover:bg-muted flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                      >
                        Form Pendaftaran
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="text-foreground/80 hover:text-foreground px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </button>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </>
              )}
            </motion.div>

            <motion.button
              className="text-foreground hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="border-border bg-background fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      <Link
                        prefetch={false}
                        href={item.href as any}
                        target={(item as any).external ? '_blank' : undefined}
                        rel={(item as any).external ? 'noopener noreferrer' : undefined}
                        className="text-foreground hover:bg-muted block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="border-border space-y-3 border-t pt-6"
                  variants={mobileItemVariants}
                >
                  {authUser ? (
                    <div className="space-y-2">
                      <div
                        title={authUser.fullName}
                        className="bg-muted/50 rounded-xl border border-border px-4 py-3"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="bg-primary text-primary-foreground inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                            {authUser.initials}
                          </span>
                          <span className="max-w-[180px] truncate text-sm font-semibold text-foreground">
                            {authUser.displayName}
                          </span>
                        </div>
                        <div className="mt-2 rounded-lg bg-background/70 px-3 py-2 text-center">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Profil
                          </p>
                          <p className="truncate text-sm text-foreground" title={authUser.fullName}>
                            {authUser.fullName}
                          </p>
                        </div>
                      </div>
                      <Link
                        prefetch={false}
                        href="/profil"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Profil
                      </Link>
                      <Link
                        prefetch={false}
                        href="/form-pendaftaran"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Form Pendaftaran
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-destructive hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowRegisterModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Sign Up
                      </button>
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
