import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiArchive, FiBarChart2, FiChevronLeft, FiChevronRight, FiSettings, FiUser, FiMessageSquare } from 'react-icons/fi';
import SettingsModal from './SettingsModal';
import { FileBarChartIcon } from 'lucide-react';

const Sidebar = ({ isCollapsed, setCollapsed }) => {
  const pathname = usePathname();
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/dashboard/reflection', label: 'Reflection', icon: FiMessageSquare },
    { href: '/dashboard/archive', label: 'Archive', icon: FiArchive },
    { href: '/dashboard/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/dashboard/achievements', label: 'Achievements', icon: FileBarChartIcon },
    { href: '/dashboard/profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <aside
      className={`h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20 ' : 'w-64'
      } bg-background dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && <h1 className="text-xl font-bold text-BrandPrimary">Elevare</h1>}
        <button 
          onClick={() => setCollapsed(!isCollapsed)} 
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center  p-3 rounded-lg transition-colors ${
                  pathname === link.href 
                    ? 'bg-BrandPrimary text-white hover:bg-BrandPrimary/90' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-BrandPrimary/80 hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                <link.icon className="mr-3 text-lg" />
                {!isCollapsed && <span className="font-medium ">{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto px-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="hover:bg-BrandPrimary/80 hover:text-white flex items-center p-3 rounded-lg w-full text-gray-700 dark:text-gray-300  dark:hover:bg-gray-700 transition-colors"
        >
          <FiSettings className="mr-3 text-lg" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </aside>
  );
};

export default Sidebar;
