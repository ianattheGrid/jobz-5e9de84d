-- Ensure inserts are allowed for users on user_push_subscriptions via RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' 
      AND tablename='user_push_subscriptions' 
      AND policyname='Users can manage their own push subscriptions'
  ) THEN
    -- Add WITH CHECK so INSERTs are permitted when user_id matches auth.uid()
    ALTER POLICY "Users can manage their own push subscriptions"
    ON public.user_push_subscriptions
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  ELSE
    -- Fallback: create explicit policies if the combined one doesn't exist
    CREATE POLICY "Users can view their own push subscriptions"
      ON public.user_push_subscriptions
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own push subscriptions"
      ON public.user_push_subscriptions
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own push subscriptions"
      ON public.user_push_subscriptions
      FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own push subscriptions"
      ON public.user_push_subscriptions
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END$$;