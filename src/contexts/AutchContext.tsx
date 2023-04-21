import api from "@/utils/api";
import { useRouter } from "next/router";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: null | Record<string, any>;
  login: ({ email, password }: { email: string; password: string }) => void;
  logout: () => void;
};

const AuthInitialValue: AuthContextType = {
  isLogged: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(AuthInitialValue);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadFinished, setInitialLoadFinished] = useState(false);
  const [user, setUser] = useState<null | Record<string, any>>(null);
  const router = useRouter();

  const goTo = useCallback(
    async (destination: string) => {
      if (router.pathname === destination) return;
      await router.push(destination);
    },
    [router]
  );

  const _login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const response = await api.fetch("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", response.access_token);
    },
    []
  );

  const _getUser = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = await api.fetch("auth/me");
    setUser(user);
  }, []);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const loginPromise = new Promise<void>(async (resolve, reject) => {
        await _login({ email, password });
        await _getUser();
        resolve();
      });
      await toast.promise(loginPromise, {
        loading: "Loading...",
        success: "Login successful",
        error: (err) =>
          err.statusCode === 429 ? "Too many requests" : "Login failed",
      });
      setIsLogged(true);
      goTo("/");
    },
    [_login, _getUser, goTo]
  );

  const logout = useCallback(() => {
    setIsLogged(false);
    goTo("/login");
  }, [goTo]);

  const _handleInitialLoad = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogged(true);
      await _getUser();
      if (router.pathname === "/login") {
        await goTo("/");
      }
    } else {
      await goTo("/login");
      setIsLogged(false);
    }
    setInitialLoadFinished(true);
  }, [_getUser, goTo, router]);

  useEffect(() => {
    _handleInitialLoad();
  }, [_handleInitialLoad]);

  api.updateToken = () => goTo("/login");

  useEffect(() => {
    if (!initialLoadFinished) return;
    if (
      (router.pathname === "/login" && isLoading) ||
      (router.pathname !== "/login" && isLogged && isLoading)
    ) {
      setIsLoading(false);
    }
  }, [router.pathname, isLoading, isLogged, initialLoadFinished]);

  return (
    <AuthContext.Provider value={{ isLogged, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
