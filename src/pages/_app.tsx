import "@/styles/globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import Base from "./_base";
import Head from "next/head";
import { ApiProvider } from "@/contexts/ApiContext";
import { ConfirmDialog } from "primereact/confirmdialog";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>Dashbard</title>
        <meta
          name="description"
          content="A simple dashboard for all your stuff"
        />
      </Head>
      <Base>
        <ApiProvider>
          <Component {...pageProps} />
        </ApiProvider>
      </Base>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "var(--primary-900)",
            color: "#fff",
          },
        }}
      />
      <ConfirmDialog />
    </AuthProvider>
  );
}
