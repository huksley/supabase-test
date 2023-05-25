import React, { Component, ComponentType, Fragment, useEffect } from "react";
import { useSessionContext, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AuthUser } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Shell } from "./Shell";

export type WithPageAuthRequired = <
  P extends {
    /**
     * Supabase user (i.e. system user)
     **/
    user: AuthUser;
  }
>(
  Component: ComponentType<P>,
  options?: {
    protected?: boolean;
    signIn?: React.ReactNode;
    onboarding?: React.ReactNode;
  }
) => React.FC<Omit<P, "user">>;

/** Check user auth */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, session, error } = useSessionContext();
  const supabase = useSupabaseClient();
  const user = useUser();

  // Authorize if not logged in
  if (!session) {
    if (error) {
      console.info("Session error", error);
    }
    return isLoading ? (
      <Shell key="AuthGuard" message="Loading..." />
    ) : (
      <Shell key="Auth">
        <Auth
          supabaseClient={supabase}
          magicLink
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["google"]}
        />
      </Shell>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};
