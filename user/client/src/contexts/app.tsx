import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import handleError from "@/utils/handleError";

interface AppContextType {
  loading: boolean;
  setLoading: (l: boolean) => void;
  unread: number;
  setUnread: (u: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { axios, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const { data } = await axios.get("/notification/unread");
        if (data.success) {
          setUnread(data.count);
        }
      } catch (err) {
        handleError(err);
      }
    };

    fetchUnread();
    // eslint-disable-next-line
  }, [user]);

  const value: AppContextType = {
    loading,
    setLoading,
    unread,
    setUnread,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;

// Hook for consuming the context
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
};
