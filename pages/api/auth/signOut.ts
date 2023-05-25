import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({ error: error.message });
    } else if (req.query.redirectTo) {
      return res.redirect(req.query.redirectTo as string).status(304)
    } else {
      return res.status(200).json({ message: "success" });
    }
  } else
  if (req.query.redirectTo) {
    return res.redirect(req.query.redirectTo as string).status(304)
  } else {
    return res.status(200).json({ message: "success" });
  }
};

export default handler;
