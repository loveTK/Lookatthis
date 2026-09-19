import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

const UPDATED = "2026-09-19";

export default function Privacy() {
  return (
    <article className="prose-lat mx-auto max-w-2xl px-4 py-12">
      <h1>Privacy Policy</h1>
      <p>Last updated {UPDATED}. Look At This (we) runs the website and app at this domain. This page says what we collect and why.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account</strong>: your email address (or Google account email) and the handle you choose.</li>
        <li><strong>Posts</strong>: the photo, title, text and the coordinates of the place you post about. EXIF metadata is stripped from photos before storage.</li>
        <li><strong>Interactions</strong>: upvotes, comments, appraisals and reports you submit.</li>
        <li><strong>Payments</strong>: handled by Lemon Squeezy. We receive the order id, product and your user id. We never see card details.</li>
      </ul>

      <h2>What we do not collect</h2>
      <p>We do not store your live location. Your device location is used once, in your browser, to center the map or to tag a post you choose to publish. Only the coordinates of published posts are saved.</p>

      <h2>How we use it</h2>
      <ul>
        <li>Show posts on the map and in city pages.</li>
        <li>Translate post text into the language of the reader. Translations are cached.</li>
        <li>Screen photos automatically for adult or violent content.</li>
        <li>Enforce limits (one vote per post, inventory slots) and act on reports.</li>
      </ul>

      <h2>Processors</h2>
      <p>Supabase (database, auth, storage), Google Cloud (maps, geocoding, image screening, translation), Lemon Squeezy (payments), Vercel (hosting).</p>

      <h2>Your choices</h2>
      <p>Delete a post at any time. To delete your account and all data, email <a href="mailto:hello@lookatthis.app">hello@lookatthis.app</a> from your account email. We remove it within 30 days.</p>

      <h2>Cookies</h2>
      <p>One session cookie for login and one for your language choice. No advertising trackers.</p>
    </article>
  );
}
