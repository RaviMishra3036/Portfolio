-- Keep the newest site settings row so About and site settings load reliably.
DELETE FROM public.site_settings
WHERE id NOT IN (
  SELECT id
  FROM public.site_settings
  ORDER BY updated_at DESC NULLS LAST, id DESC
  LIMIT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS site_settings_single_row_unique
  ON public.site_settings ((true));
