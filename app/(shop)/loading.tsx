export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sabi-light">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 border-2 border-saffron/20 border-t-saffron rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-saffron font-bold text-sm">SS</span>
          </div>
        </div>
        <p className="text-xs tracking-widest uppercase text-sabi-grey">Loading</p>
      </div>
    </div>
  );
}
