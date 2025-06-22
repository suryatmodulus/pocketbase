import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    pageTitle: '',
    appName: 'PocketBase', // Default app name
    hideControls: false,
  });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
