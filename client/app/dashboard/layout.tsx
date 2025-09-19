'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Dashboard/Navbar';
import Sidebar from './components/Dashboard/Sidebar';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import Loading from '../loading';

function DashboardInner({
  children,
  isSidebarCollapsed,
  setSidebarCollapsed,
}: {
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main
          role="main"
          className={`flex-1 overflow-x-hidden overflow-y-auto ${theme}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Persist sidebar collapse state in localStorage.
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved) setSidebarCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Hydration guard to avoid flicker.
  useEffect(() => setMounted(true), []);

  if (process.env.NODE_ENV === 'development') {
    console.log('[DashboardLayout] Session status:', status);
    console.log('[DashboardLayout] Session data:', session);
  }

  // Auth handling.
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading' || !mounted) {
    return <Loading />;
  }

  // Derive theme preference safely.
  const rawTheme = session?.user?.themePreference?.toLowerCase();
  const initialTheme =
    rawTheme === 'modern' || rawTheme === 'minimal' ? rawTheme : undefined;

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <DashboardInner
        isSidebarCollapsed={isSidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      >
        {children}
      </DashboardInner>
    </ThemeProvider>
  );
}
