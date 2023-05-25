import "./globals.css";
import type { AppProps } from "next/app";
import UserProvider from "@/components/UserProvider";
import Head from "next/head";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { AuthGuard } from "@/components/AuthGuard";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  

  return (
    <>
      <Head>
        <meta name="theme-color" content="#000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <div className="flex flex-col min-h-screen max-h-screen">
          <AuthGuard>
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          </AuthGuard>
        </div>
      </SessionContextProvider>
    </>
  );
}

export default MyApp;
