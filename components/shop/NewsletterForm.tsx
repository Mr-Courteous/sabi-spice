"use client";

// NOTE: not wired to a mailing list yet (same as the original). Connect it to Resend Audiences / Mailchimp before launch.
export default function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
      <input type="email" required placeholder="you@email.com" className="flex-1 px-5 py-3 rounded-full bg-white text-sabi-black border-2 border-sabi-black text-sm focus:outline-none" />
      <button type="submit" className="btn-saffron whitespace-nowrap">Sign me up</button>
    </form>
  );
}
