CREATE TABLE public.server_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id UUID NOT NULL REFERENCES public.linked_panels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identifier TEXT NOT NULL,
  name TEXT,
  state TEXT DEFAULT 'offline',
  memory_limit INTEGER,
  cpu_limit INTEGER,
  disk_limit INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(panel_id, identifier)
);

ALTER TABLE public.server_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own servers" ON public.server_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own servers" ON public.server_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own servers" ON public.server_links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own servers" ON public.server_links
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_server_links_user_id ON public.server_links(user_id);
CREATE INDEX idx_server_links_panel_id ON public.server_links(panel_id);
