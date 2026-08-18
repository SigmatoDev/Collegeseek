export default function CareersLoading() {
  return (
    <main className="min-h-screen bg-[#f9f9f7] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-10 w-56 rounded bg-gray-200" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-64 rounded-2xl bg-white shadow-sm" />)}
        </div>
      </div>
    </main>
  );
}
