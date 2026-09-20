"use client";
import { useState } from "react";
import toast from "react-hot-toast";

const EVENT_TYPES = ["Birthday", "Wedding / Engagement", "Corporate / Office", "Naming ceremony", "Graduation", "Church / Community", "Other"];
const BUDGETS = ["Under $250", "$250 – $500", "$500 – $1,000", "$1,000+", "Not sure yet"];

export default function CateringForm({ defaultPackage = "" }: { defaultPackage?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "", eventDate: "", guests: "", location: "", budget: "", message: defaultPackage ? `I'm interested in: ${defaultPackage}` : "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const today = new Date().toISOString().split("T")[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/catering", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send request");
      setSent(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div className="bg-white border border-sabi-leaf/10 rounded-2xl p-10 text-center">
      <p className="font-script text-saffron text-5xl mb-2">Thank you!</p>
      <h3 className="font-serif text-2xl text-sabi-black mb-3">Your request is in.</h3>
      <p className="text-sabi-grey text-sm max-w-sm mx-auto">We've emailed you a copy. We'll review the details and get back to you with a quote.</p>
    </div>
  );

  const L = ({ t }: { t: string }) => <label className="block text-xs tracking-widest uppercase text-sabi-grey mb-2">{t}</label>;
  return (
    <form onSubmit={submit} className="bg-white border border-sabi-leaf/10 rounded-2xl p-7 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><L t="Your name *" /><input required value={form.name} onChange={(e) => set("name", e.target.value)} className="input-field" /></div>
        <div><L t="Phone *" /><input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input-field" placeholder="(555) 123-4567" /></div>
        <div className="sm:col-span-2"><L t="Email *" /><input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input-field" /></div>
        <div><L t="Event type *" />
          <select required value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className="input-field"><option value="">Select…</option>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><L t="Event date *" /><input required type="date" min={today} value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className="input-field" /></div>
        <div><L t="Guests *" /><input required type="number" min={1} max={5000} value={form.guests} onChange={(e) => set("guests", e.target.value)} className="input-field" /></div>
        <div><L t="Budget" />
          <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className="input-field"><option value="">Select…</option>{BUDGETS.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div className="sm:col-span-2"><L t="Event location (city & ZIP) *" /><input required value={form.location} onChange={(e) => set("location", e.target.value)} className="input-field" /></div>
        <div className="sm:col-span-2"><L t="Tell us what you have in mind" />
          <textarea value={form.message} onChange={(e) => set("message", e.target.value)} className="input-field min-h-[110px] resize-none" placeholder="Dishes you love, dietary needs, pickup or delivery…" /></div>
      </div>
      <button disabled={loading} className="btn-saffron w-full">{loading ? "Sending…" : "Request a Quote"}</button>
    </form>
  );
}
