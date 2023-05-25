ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_insert ON public.messages
  FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY messages_delete_userid ON public.messages
  FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY messages_read_all ON public.messages
  FOR DELETE
    USING (auth.uid() = user_id);

