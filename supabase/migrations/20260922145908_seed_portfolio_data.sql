/*
# Seed initial portfolio data

Inserts default data into all tables so the portfolio is populated on first load.
All data is for a Java Full Stack Developer portfolio.
*/

-- Profile
INSERT INTO profile (name, title, bio, photo_url)
VALUES (
  'Ravi Kumar Mishra',
  'Java Full Stack Developer',
  'I am a passionate Java Full Stack Developer with expertise in building scalable web applications using Spring Boot, React, and modern cloud technologies. With over 5 years of experience, I specialize in creating robust backend architectures and immersive frontend experiences.',
  NULL
) ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES
('Java', 'Backend', 95, 'Code', 1),
('Spring Boot', 'Backend', 90, 'Server', 2),
('Hibernate / JPA', 'Backend', 85, 'Database', 3),
('REST API', 'Backend', 88, 'Globe', 4),
('HTML5', 'Frontend', 90, 'Code', 5),
('CSS3', 'Frontend', 85, 'Palette', 6),
('JavaScript', 'Frontend', 88, 'Code', 7),
('React', 'Frontend', 85, 'Component', 8),
('TypeScript', 'Frontend', 80, 'Code', 9),
('MySQL', 'Database', 88, 'Database', 10),
('PostgreSQL', 'Database', 82, 'Database', 11),
('Git / GitHub', 'Tools', 90, 'Github', 12),
('Docker', 'DevOps', 75, 'Box', 13),
('AWS', 'DevOps', 70, 'Cloud', 14),
('Maven', 'Tools', 85, 'Package', 15)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (title, short_description, detailed_description, technologies, github_url, live_demo_url, category, featured) VALUES
('E-Commerce Platform',
 'Full-featured e-commerce platform with product catalog, cart, and payment integration.',
 'A comprehensive e-commerce solution built with Spring Boot and React. Features include product management, shopping cart, Stripe payment integration, order tracking, admin dashboard, and real-time inventory management.',
 ARRAY['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Stripe API', 'Docker'],
 'https://github.com/ravikumarmishra/ecommerce-platform',
 'https://ecommerce-demo.example.com',
 'Full Stack',
 true),
('Task Management System',
 'Enterprise task management system with team collaboration features.',
 'A collaborative task management application supporting project boards, task assignment, real-time notifications, and progress tracking. Built with Spring Boot backend and React frontend.',
 ARRAY['Java', 'Spring Boot', 'React', 'WebSocket', 'PostgreSQL'],
 'https://github.com/ravikumarmishra/task-manager',
 'https://taskmanager-demo.example.com',
 'Full Stack',
 true),
('REST API Gateway',
 'Scalable API gateway with rate limiting and authentication.',
 'A microservices API gateway handling routing, rate limiting, JWT authentication, and request logging. Built with Spring Cloud Gateway.',
 ARRAY['Java', 'Spring Cloud', 'JWT', 'Redis', 'Docker'],
 'https://github.com/ravikumarmishra/api-gateway',
 NULL,
 'Backend',
 false),
('Portfolio Analytics Dashboard',
 'Real-time analytics dashboard for tracking portfolio visitors.',
 'A analytics dashboard that tracks visitor metrics, page views, and engagement. Features real-time charts and data visualization.',
 ARRAY['React', 'TypeScript', 'Spring Boot', 'Chart.js'],
 'https://github.com/ravikumarmishra/analytics-dashboard',
 'https://analytics-demo.example.com',
 'Full Stack',
 false),
('Library Management System',
 'Complete library management system with book tracking and member management.',
 'A library management system with features for book checkout, returns, member management, fine calculation, and inventory tracking.',
 ARRAY['Java', 'Spring Boot', 'JPA', 'MySQL', 'Thymeleaf'],
 'https://github.com/ravikumarmishra/library-system',
 NULL,
 'Backend',
 false),
('Chat Application',
 'Real-time chat application with group messaging and file sharing.',
 'A real-time messaging app with WebSocket support, group chats, file sharing, typing indicators, and message history.',
 ARRAY['Java', 'Spring Boot', 'WebSocket', 'React', 'Redis'],
 'https://github.com/ravikumarmishra/chat-app',
 'https://chat-demo.example.com',
'Full Stack',
 true)
ON CONFLICT DO NOTHING;

-- Education
INSERT INTO education (degree, institution, start_date, end_date, description, display_order) VALUES
('Master of Computer Applications (MCA)', 'Indian Institute of Technology, Delhi', '2018', '2020', 'Specialized in Distributed Systems and Cloud Computing. Thesis on microservices architecture patterns.', 1),
('Bachelor of Computer Applications (BCA)', 'University of Mumbai', '2015', '2018', 'Graduated with distinction. Focus on software engineering and database management systems.', 2)
ON CONFLICT DO NOTHING;

-- Experience
INSERT INTO experience (position, company, start_date, end_date, description, display_order) VALUES
('Senior Java Full Stack Developer', 'TechCorp Solutions', '2023', 'Present', 'Leading development of microservices-based enterprise applications. Mentoring junior developers and driving architectural decisions. Managing CI/CD pipelines and deployment strategies.', 1),
('Java Developer', 'InnovateSoft', '2021', '2023', 'Developed and maintained RESTful APIs using Spring Boot. Implemented authentication and authorization with JWT. Built responsive frontend interfaces with React.', 2),
('Junior Software Developer', 'CodeCraft Labs', '2020', '2021', 'Worked on bug fixes and feature development for enterprise Java applications. Gained experience with JPA/Hibernate and MySQL database optimization.', 3)
ON CONFLICT DO NOTHING;

-- Certifications
INSERT INTO certifications (name, issuer, issue_date, credential_url, display_order) VALUES
('AWS Certified Solutions Architect – Associate', 'Amazon Web Services', '2024', NULL, 1),
('Spring Professional Certification', 'VMware', '2023', NULL, 2),
('Oracle Certified Professional: Java SE 11 Developer', 'Oracle', '2022', NULL, 3),
('Meta Front-End Developer Professional Certificate', 'Meta', '2023', NULL, 4)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (title, description, icon, display_order) VALUES
('Backend Development', 'Robust and scalable backend solutions using Java, Spring Boot, and microservices architecture.', 'Server', 1),
('Frontend Development', 'Modern, responsive, and interactive web interfaces with React and TypeScript.', 'Layout', 2),
('Full Stack Development', 'End-to-end web application development from database design to deployment.', 'Layers', 3),
('API Design & Integration', 'RESTful API design, third-party API integration, and API gateway implementation.', 'Globe', 4),
('Database Optimization', 'Database design, query optimization, and performance tuning for MySQL and PostgreSQL.', 'Database', 5),
('Cloud & DevOps', 'AWS deployment, Docker containerization, and CI/CD pipeline setup.', 'Cloud', 6)
ON CONFLICT DO NOTHING;

-- Social Links
INSERT INTO social_links (platform, url, icon, display_order) VALUES
('GitHub', 'https://github.com/ravikumarmishra', 'Github', 1),
('LinkedIn', 'https://linkedin.com/in/ravikumarmishra', 'Linkedin', 2),
('Instagram', 'https://instagram.com/ravikumarmishra', 'Instagram', 3),
('YouTube', 'https://youtube.com/@ravikumarmishra', 'Youtube', 4),
('Twitter', 'https://twitter.com/ravikumarmishra', 'Twitter', 5),
('Email', 'mailto:ravi.kumar.mishra@example.com', 'Mail', 6)
ON CONFLICT DO NOTHING;

-- Achievements
INSERT INTO achievements (title, description, date, display_order) VALUES
('Hackathon Winner 2024', 'Won first place at the National Java Hackathon for building a real-time collaboration tool.', '2024', 1),
('Open Source Contributor', 'Contributed to multiple open-source projects with over 500 GitHub stars combined.', '2023', 2),
('Speaker at JavaConf India', 'Delivered a talk on "Microservices with Spring Boot and Spring Cloud" at JavaConf India 2023.', '2023', 3),
('Employee of the Year', 'Recognized as Employee of the Year at TechCorp Solutions for outstanding contributions.', '2023', 4)
ON CONFLICT DO NOTHING;

-- Site Settings
INSERT INTO site_settings (theme, site_title, meta_description)
VALUES ('dark', 'Ravi Kumar Mishra — Java Full Stack Developer', 'Portfolio of Ravi Kumar Mishra, a Java Full Stack Developer specializing in Spring Boot, React, and cloud technologies.')
ON CONFLICT DO NOTHING;
