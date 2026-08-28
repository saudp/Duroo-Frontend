# WordPress backend snippets

These PHP files aren't run by this Next.js app — they're theme code for the
WordPress install at `duroo.in`, kept here for version control since they
deploy alongside the About page frontend.

## Setup (do this in wp-admin / the WP theme, not this repo)

1. Copy both files into your theme, e.g. `wp-content/themes/your-theme/inc/`,
   and `require_once` both from `functions.php`. Requires **ACF PRO**
   (`acf-about-fields.php` uses an Options Page).
2. In wp-admin, go to **About Page** (new menu item, below Pages) and fill
   in the content — Origin Story, The Name, Philosophy, CTA. Images are
   optional; `PearlThreadMotif` fills in for any that are left empty.
3. Confirm the endpoint responds: `https://duroo.in/wp-json/duroo/v1/about`
   should return JSON matching `AboutPageData` in `lib/types.ts`.

Until step 2 is done, `/about` on the frontend renders the copy baked into
`FALLBACK_DATA` in `app/about/page.tsx` — the page is never blank, it just
isn't editable from wp-admin yet.

The cache busts automatically on save (`acf/save_post` hook in
`rest-about-endpoint.php`), and the frontend's own ISR (`lib/about.ts`,
`revalidate: 3600`) re-fetches at most once an hour after that.
