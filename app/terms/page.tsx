import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

const UPDATED = "2026-09-19";

export default function Terms() {
  return (
    <article className="prose-lat mx-auto max-w-2xl px-4 py-12">
      <h1>Terms of Service</h1>
      <p>Last updated {UPDATED}. By using Neighbrag you agree to these terms.</p>

      <h2>Appraisals are opinions</h2>
      <p>Dollar values shown on posts are community opinions. They are not offers, valuations, or advice. Nothing on Neighbrag can be bought, sold, traded or withdrawn.</p>

      <h2>Your content</h2>
      <p>You keep ownership of what you post. You give us a license to display, resize and translate it as part of the service. Post only what you have the right to share. Do not post private information about other people, adult or violent content, or spam.</p>

      <h2>Location</h2>
      <p>Posts tagged with GPS compete for the local #1 spot. Posts tagged by approximate (IP) location do not. Do not fake your location.</p>

      <h2>Inventory slots</h2>
      <p>Every account gets one free slot. Additional slots are a one-time purchase through Lemon Squeezy and are not refundable once used. Slots have no cash value.</p>

      <h2>Moderation</h2>
      <p>Content reported three times is hidden automatically. We may remove content or suspend accounts that break these terms, without notice.</p>

      <h2>No warranty</h2>
      <p>The service is provided as is. We are not liable for lost content or any damages arising from use of the service, to the extent permitted by law.</p>

      <h2>Contact</h2>
      <p><a href="mailto:hello@neighbrag.app">hello@neighbrag.app</a></p>
    </article>
  );
}
