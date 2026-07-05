export default function Loading() {
  return (
    <div className="flex flex-col gap-4 pt-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card h-24 animate-pulse opacity-60" />
      ))}
    </div>
  );
}
