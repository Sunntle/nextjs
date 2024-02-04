"use client"
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { createContext, useContext, useMemo } from "react";

type AppProviderProps = {
  children?: React.ReactNode;
  language: string;
};
const AppContext = createContext({language: "en", isMobile: false});

const AppProvider = ({ children, language }: AppProviderProps) => {
  const breakpoints = useBreakpoints();
  const isMobile = useMemo(
    () => breakpoints.isXs || breakpoints.isSm || breakpoints.isMd,
    [breakpoints]
  );
  return (
    <AppContext.Provider value={{language, isMobile }}>
    {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const appContext = useContext(AppContext);
  return appContext;
};

export default AppProvider;
