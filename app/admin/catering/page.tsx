import { prisma } from "@/lib/prisma";
import CateringStatusSelect from "@/components/admin/CateringStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminCateringPage() {
  const requests = await prisma.cateringRequest.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-sabi-black">Catering Requests</h1>
        <p className="text-sabi-grey text-sm mt-1">{requests.length} total · reply to the customer by email or phone to send a quote</p>
      </div>
      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Customer", "Event", "Guests", "Location / Budget", "Notes", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widest uppercase text-sabi-grey font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 align-top">
                <td className="px-5 py-4">
                  <p className="font-medium text-sabi-black">{r.name}</p>
                  <a href={`mailto:${r.email}`} className="text-xs text-saffron block">{r.email}</a>
                  <a href={`tel:${r.phone}`} className="text-xs text-sabi-grey">{r.phone}</a>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sabi-black">{r.eventType}</p>
                  <p className="text-xs text-sabi-grey">{new Date(r.eventDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                </td>
                <td className="px-5 py-4 font-medium">{r.guests}</td>
                <td className="px-5 py-4 text-sabi-grey"><p>{r.location}</p><p className="text-xs">{r.budget || "—"}</p></td>
                <td className="px-5 py-4 text-xs text-sabi-grey max-w-xs whitespace-pre-wrap">{r.message || "—"}</td>
                <td className="px-5 py-4"><CateringStatusSelect id={r.id} status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <div className="text-center py-16 text-sabi-grey"><p className="font-serif text-lg">No catering requests yet</p></div>}
      </div>
    </div>
  );
}
