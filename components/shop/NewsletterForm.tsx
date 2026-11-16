"use client";

// NOTE: not wired to a mailing list yet (same as the original). Connect it to Resend Audiences / Mailchimp before launch.
export default function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-2.5 max-w-md" onSubmit={(e) => e.preventDefault()}>
      <input type="email" required aria-label="Email address" placeholder="you@email.com" className="flex-1 px-5 py-3 rounded-full bg-white/10 text-white placeholder:text-white/40 ring-1 ring-inset ring-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-light" />
      <button type="submit" className="btn-saffron whitespace-nowrap">Sign me up</button>
    </form>
  );
}
