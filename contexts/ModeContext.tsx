"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModeContextType {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <ModeContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
} 