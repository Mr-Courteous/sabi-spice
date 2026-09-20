"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const STATUSES = ["NEW", "QUOTED", "CONFIRMED", "DECLINED"];

export default function CateringStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  async function change(next: string) {
    const prev = value;
    setValue(next);
    const res = await fetch(`/api/admin/catering/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }),
    });
    if (!res.ok) { setValue(prev); return toast.error("Could not update status"); }
    toast.success(`Marked ${next.toLowerCase()}`);
    router.refresh();
  }
  return (
    <select value={value} onChange={(e) => change(e.target.value)} className="input-field !py-1.5 !px-2 text-xs w-32">
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
