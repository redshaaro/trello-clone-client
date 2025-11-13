import React, { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
    const [boards, setBoards] = useState({
        ownedBoards: [],
        memberBoards: []
    });
    const value = { boards, setBoards }





    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for easy access to the context
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}