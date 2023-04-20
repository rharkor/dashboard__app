import "@/styles/globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AutchContext";
import Base from "./_base";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Base>
        <Component {...pageProps} />
      </Base>
      <Toaster />
    </AuthProvider>
  );
}
