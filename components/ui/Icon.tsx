const PATHS: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10",
  menu: "M7 3v8M4 3v5a3 3 0 0 0 3 3 3 3 0 0 0 3-3V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7.5 0 2 1 3 3.5 3",
  party: "M4 20l4.5-12.5L16 15 4 20zM14 4l.6 2.4M18.5 7.5 21 7M19 12.5l2 .8M10 5l1 1",
  bag: "M5 8h14l-1 12H6L5 8zM9 8V6.5a3 3 0 0 1 6 0V8",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.5-3.5 3.7-5.5 8-5.5s7.5 2 8 5.5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14M13 6l6 6-6 6",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  store: "M4 9l1.5-5h13L20 9M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M5 12v8h14v-8M10 20v-5h4v5",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9zM3 7.5l9 4.5 9-4.5M12 12v9",
  check: "M5 12.5l4.5 4.5L19 7.5",
};

export default function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  if (name === "star") {
    return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" /></svg>;
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] || ""} />
    </svg>
  );
}
