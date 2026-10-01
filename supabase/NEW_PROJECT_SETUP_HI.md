# नए Supabase Project का Setup

नए project में admin के सभी Add/Edit buttons चलाने के लिए database schema बनाना जरूरी है।

## 1. Database tables बनाएं

Supabase Dashboard खोलें और **SQL Editor -> New query** पर जाएं। फिर project की इन files को इसी क्रम में खोलकर पूरा SQL paste करके **Run** दबाएं:

1. `20260922145728_create_portfolio_schema.sql`
2. `20260922145754_fix_index_and_seed.sql`
3. `20260922145808_fix_index_featured.sql`
4. `20260922145830_fix_index_final.sql`
5. `20260922145908_seed_portfolio_data.sql`
6. `20260923160000_remove_seed_duplicates.sql`
7. `20260923170000_update_social_links.sql`
8. `20260923180000_create_project_images_bucket.sql`

सबसे जरूरी पहली file है। इसी से `profile`, `skills`, `projects`, `education`, `certifications`, `services`, `social_links`, `messages`, `resume`, `site_settings` और `achievements` tables बनती हैं।

## 2. Admin user बनाएं

**Authentication -> Users -> Add user -> Create new user** पर जाएं:

- Email: `ravikr151204@gmail.com`
- Password: अपना password डालें
- **Auto Confirm User**: ON

## 3. Resume upload के लिए bucket

**Storage -> New bucket** में bucket का नाम `resume` रखें और उसे **Public** करें।

## 4. जांच

**Table Editor** में `profile` table दिखनी चाहिए। इसके बाद website refresh करके admin में login करें। अब Profile, Projects, Skills आदि में Add/Edit काम करेंगे।

अगर SQL Editor में कोई error आए, तो पूरा error message भेजें। एक ही migration को दोबारा चलाने पर सामान्यतः `already exists` error को ignore किया जा सकता है।
