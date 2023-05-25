import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export const DEFAULT_REDIRECT_TO = "/";

/**
 * Invoked when user are authenticated.
 */
type AuthenticatedHandler = (user: AuthUser, supabase: SupabaseClient, req: NextApiRequest, res: NextApiResponse) => void;

/**
 * Require user sign-in at server side. Returns user and supabase client with the same privileges as on the client.
 **/
export const withApiAuthRequired =
  (
    handler: AuthenticatedHandler,
    options: { unauthorized?: "redirect" | "fail"; redirectTo?: string } = {
      unauthorized: "fail",
      redirectTo: DEFAULT_REDIRECT_TO,
    }
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient({ req, res });
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) {
      console.warn("Not authorized", req.method, req.url);
      if (options?.unauthorized === "fail") {
        return res.status(403).json({ error: "Not authorized" });
      } else {
        return res.redirect(options?.redirectTo || DEFAULT_REDIRECT_TO);
      }
    } else {
      return handler(session.user, supabase, req, res);
    }
  };
