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
  isLogged: null | boolean;
  login: ({ email, password }: { email: string; password: string }) => void;
  logout: () => void;
};

const AuthInitialValue: AuthContextType = {
  isLogged: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(AuthInitialValue);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<null | boolean>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const goToLogin = useCallback(async () => {
    if (router.pathname === "/login" || isRedirecting) return;
    setIsRedirecting(true);
    await router.push("/login");
    setIsRedirecting(false);
  }, [router, isRedirecting]);

  const goToHome = useCallback(async () => {
    if (router.pathname === "/" || isRedirecting) return;
    setIsRedirecting(true);
    await router.push("/");
    setIsRedirecting(false);
  }, [router, isRedirecting]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const loginPromise = api.fetch("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const response = await toast.promise(loginPromise, {
        loading: "Loading...",
        success: "Login successful",
        error: (err) => {
          if (err.statusCode === 429) {
            return "Too many requests";
          }
          return "Login failed";
        },
      });
      setIsLogged(true);
      localStorage.setItem("token", response.access_token);
      goToHome();
    },
    [goToHome]
  );

  const logout = useCallback(() => {
    setIsLogged(false);
    goToLogin();
  }, [goToLogin]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogged(true);
    } else {
      goToLogin();
      setIsLogged(false);
    }
  }, [goToLogin]);

  api.updateToken = goToLogin;

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
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
