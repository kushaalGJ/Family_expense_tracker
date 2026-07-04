export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-card h-24 animate-pulse" />
      ))}
    </div>
  );
}
