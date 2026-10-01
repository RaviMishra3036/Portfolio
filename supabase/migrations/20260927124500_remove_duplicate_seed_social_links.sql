-- Remove placeholder social links that were duplicated by the seed data.
DELETE FROM public.social_links
WHERE url ILIKE '%arjunmehta%';
