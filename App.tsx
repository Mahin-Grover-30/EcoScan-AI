import React, { useState, useMemo, useEffect } from 'react';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import Education from './components/Education';
import Auth from './components/Auth';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { User, HistoryItem } from './types';

export const UserContext = React.createContext<{
  user: User | null;
  logout: () => void;
  addHistory: (item: HistoryItem) => void;
} | null>(null);

// Simulating a "database" of users in localStorage
const getUsersFromStorage = (): Record<string, User> => {
    const users = localStorage.getItem('ecoScanUsers');
    return users ? JSON.parse(users) : {};
};

const saveUsersToStorage = (users: Record<string, User>) => {
    localStorage.setItem('ecoScanUsers', JSON.stringify(users));
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'scanner' | 'dashboard' | 'education'>('scanner');
  const [user, setUser] = useState<User | null>(null);

  // Check for an active session on initial load
  useEffect(() => {
    const activeUserEmail = localStorage.getItem('activeEcoScanUserEmail');
    if (activeUserEmail) {
      const users = getUsersFromStorage();
      const loggedInUser = users[activeUserEmail];
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    }
  }, []);

  const handleSignUp = async (email: string, password: string): Promise<void> => {
    const users = getUsersFromStorage();
    if (users[email]) {
        throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
        name: email.split('@')[0], // Default name from email
        email: email,
        password: password, // In a real app, this should be hashed!
        points: 0,
        level: 1,
        history: [],
    };
    users[email] = newUser;
    saveUsersToStorage(users);
    
    // Log the new user in
    localStorage.setItem('activeEcoScanUserEmail', email);
    setUser(newUser);
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const users = getUsersFromStorage();
    const existingUser = users[email];
    if (!existingUser || existingUser.password !== password) {
        throw new Error('Invalid email or password.');
    }

    localStorage.setItem('activeEcoScanUserEmail', email);
    setUser(existingUser);
  };

  const logout = () => {
    localStorage.removeItem('activeEcoScanUserEmail');
    setUser(null);
    setActiveView('scanner'); // Reset view on logout
  };

  const addHistory = (item: HistoryItem) => {
    if (!user) return;

    // Update the user object
    const updatedUser = {
      ...user,
      points: user.points + item.points,
      history: [item, ...user.history],
    };

    // Update the user state
    setUser(updatedUser);
    
    // Update the user in our localStorage "database"
    const users = getUsersFromStorage();
    if (users[user.email]) {
        users[user.email] = updatedUser;
        saveUsersToStorage(users);
    }
  };

  const userContextValue = useMemo(() => ({ user, logout, addHistory }), [user]);

  const renderView = () => {
    switch (activeView) {
      case 'scanner':
        return <Scanner />;
      case 'dashboard':
        return <Dashboard />;
      case 'education':
        return <Education />;
      default:
        return <Scanner />;
    }
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <div className="min-h-screen flex flex-col font-sans bg-background dark:bg-background-dark">
        <Header activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {user ? renderView() : <Auth onLogin={handleLogin} onSignUp={handleSignUp} />}
        </main>
        {/* Responsive Navigation: Show bottom nav only on mobile screens when logged in */}
        {user && <div className="md:hidden">
            <BottomNav activeView={activeView} setActiveView={setActiveView} />
        </div>}
      </div>
    </UserContext.Provider>
  );
};

export default App;
