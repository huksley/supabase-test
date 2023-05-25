import React, { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { Shell } from "./Shell";

interface UserContext {
  /** Supabase native user, might be social login */
  user: AuthUser;
  /** Logout current user */
  signOut: () => void;
  /** Invalidate user, for example after update */
  invalidate: () => void;
}

export const UserContext = React.createContext<Partial<UserContext>>({});

export const signOutUser = async (supabaseClient: SupabaseClient) => {
  console.log("Signing out", await supabaseClient.auth.getSession());
  return supabaseClient.auth.signOut().then(async (result) => {
    if (result.error) {
      console.warn("Error when signing out", result.error);
    } else {
      window.location.assign("/api/auth/signOut?redirectTo=/");
    }
  });
};

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context as UserContext;
};

function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const signOut = useCallback(() => signOutUser(supabaseClient), []);

  if (!user) {
    return <Shell message="Loading" />;
  }

  const userData = {
    user,
    signOut,
  };

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}

export default UserProvider;
