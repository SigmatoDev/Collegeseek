"use client";

const placeholderCards = Array.from({ length: 4 });

const CollegeListSkeleton = () => {
  return (
    <div className="space-y-6">
      {placeholderCards.map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 w-full">
              <div className="h-5 w-1/3 rounded-full bg-gray-200" />
              <div className="h-4 w-full rounded-full bg-gray-100" />
              <div className="h-4 w-2/3 rounded-full bg-gray-100" />
            </div>
            <div className="flex w-full flex-wrap gap-3">
              {Array.from({ length: 3 }).map((__, chipIndex) => (
                <div
                  key={chipIndex}
                  className="h-8 flex-1 rounded-full bg-gray-100"
                />
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((__, statIndex) => (
              <div
                key={statIndex}
                className="h-12 rounded-xl bg-gray-50"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollegeListSkeleton;
