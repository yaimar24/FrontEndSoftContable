import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import LoadingOverlay from "@/presentation/components/shared/LoadingOverlay";
import { loadingController } from "@/data/services/loading/loadingController";

interface LoadingContextType {
  show: () => void;
  hide: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState(0);

  const show = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const hide = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  useEffect(() => {
    loadingController.register(show, hide);
  }, [show, hide]);

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      {children}
      {count > 0 && <LoadingOverlay message="Cargando información..." />}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useGlobalLoading debe usarse dentro de LoadingProvider");
  }
  return ctx;
};
