import React, { useContext } from 'react';
import { UserContext } from '../App';

type View = 'scanner' | 'dashboard' | 'education';

interface HeaderProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const NavLink: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);


const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const userContext = useContext(UserContext);

  return (
    <header className="bg-surface dark:bg-surface-dark shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">EcoScan AI</h1>
          </div>
          
          {/* Desktop Navigation */}
          {userContext?.user && (
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink label="Scan" isActive={activeView === 'scanner'} onClick={() => setActiveView('scanner')} />
              <NavLink label="Dashboard" isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
              <NavLink label="Learn" isActive={activeView === 'education'} onClick={() => setActiveView('education')} />
            </nav>
          )}

          <div className="flex items-center">
            {userContext?.user ? (
              <>
                <span className="text-secondary dark:text-gray-300 mr-4 hidden sm:block">{userContext.user.name}</span>
                <button onClick={userContext.logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
                 <span className="text-secondary dark:text-gray-300 font-medium">Please sign in</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
