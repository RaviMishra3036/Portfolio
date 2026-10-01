-- Replace placeholder social links with the owner's current profiles.

DELETE FROM social_links
WHERE lower(trim(platform)) IN ('github', 'linkedin', 'instagram', 'youtube', 'twitter', 'email');

INSERT INTO social_links (platform, url, icon, display_order) VALUES
('GitHub', 'https://github.com/RaviMishra3036', 'Github', 1),
('LinkedIn', 'https://www.linkedin.com/in/ravi-mishra-197414377', 'Linkedin', 2),
('Instagram', 'https://www.instagram.com/ravi_mishra_9931/?hl=en', 'Instagram', 3),
('YouTube', 'https://www.youtube.com/@Ravi_Mishra_3036', 'Youtube', 4),
('Twitter', 'https://x.com/RaviMis13431036', 'Twitter', 5),
('Email', 'mailto:ravikr151204@gmail.com', 'Mail', 6);
