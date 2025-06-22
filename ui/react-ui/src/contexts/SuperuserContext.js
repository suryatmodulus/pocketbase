import React, { createContext, useState } from 'react';

const SuperuserContext = createContext();

const SuperuserProvider = ({ children }) => {
  const [superuser, setSuperuser] = useState({});

  return (
    <SuperuserContext.Provider value={{ superuser, setSuperuser }}>
      {children}
    </SuperuserContext.Provider>
  );
};

export { SuperuserContext, SuperuserProvider };
