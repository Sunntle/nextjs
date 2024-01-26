"use client"
import { useTranslation } from "@/i18n/client";
import { createContext, useContext } from "react";

type AppProviderProps = {
  children?: React.ReactNode;
  language: string;
};
const AppContext = createContext({language: "en"});

const AppProvider = ({ children, language }: AppProviderProps) => {
  return (
    <AppContext.Provider value={{language }}>
    {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const appContext = useContext(AppContext);
  return appContext;
};

export default AppProvider;
