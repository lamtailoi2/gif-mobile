import { createContext, useContext, useState } from 'react';

interface AuthLoadingContextValue {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const AuthLoadingContext = createContext<AuthLoadingContextValue>({
  isLoading: false,
  setLoading: () => {},
});

export function AuthLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthLoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
    </AuthLoadingContext.Provider>
  );
}

export function useAuthLoading() {
  return useContext(AuthLoadingContext);
}
