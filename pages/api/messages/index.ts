import { withApiAuthRequired } from "@/components/withApiAuthRequired";

const handler = withApiAuthRequired(async (systemUser, supabase, req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .limit(20)
      .order("id", { ascending: false });
    if (messages) {
      res.status(200).json(messages?.reverse());
    } else {
      console.warn("Error", error);
      res.status(500).json({
        error: `Error`,
      });
    }
  } catch (error: any) {
    console.warn("Error", error);
    res.status(500).json({
      error: `Error message: ${error.message}`,
    });
  }
});

export default handler;
