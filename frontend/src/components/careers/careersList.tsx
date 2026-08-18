import Link from "next/link";

export type PublicCareer = {
  _id: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  salary?: string;
  applicationDeadline: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function CareersList({
  careers,
  hasError,
}: {
  careers: PublicCareer[];
  hasError: boolean;
}) {
  return (
    <main className="bg-[#fffdff]">
      <section className="container-1 mx-auto bg-blue-50 px-4 py-10 sm:px-6 sm:py-[70px]">
        <div className="mb-6 border-b border-blue-100 pb-5 text-center sm:mb-8 sm:pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c25541]">Join CollegeSeek</p>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-4xl">Career Opportunities</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">Explore current opportunities and help students make confident education choices.</p>
        </div>

        {hasError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center"><h2 className="text-lg font-semibold text-red-800">We could not load open positions</h2><p className="mt-2 text-sm text-red-700">Please refresh the page and try again.</p></div> : careers.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center"><h2 className="text-lg font-semibold text-gray-800">No open positions right now</h2><p className="mt-2 text-sm text-gray-500">Please check back later for future opportunities.</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {careers.map((career) => <article key={career._id} className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_18px_40px_rgba(62,44,92,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(227,82,53,0.25)]">
            <span className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold capitalize text-[#c25541]">{career.employmentType.replace("-", " ")}</span>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{career.title}</h2>
            <dl className="mt-5 space-y-2 text-sm font-light text-gray-600"><div><dt className="inline font-semibold text-gray-700">Location: </dt><dd className="inline">{career.location}</dd></div><div><dt className="inline font-semibold text-gray-700">Experience: </dt><dd className="inline">{career.experienceRequired}</dd></div>{career.salary ? <div><dt className="inline font-semibold text-gray-700">Salary: </dt><dd className="inline">{career.salary}</dd></div> : null}<div><dt className="inline font-semibold text-gray-700">Apply by: </dt><dd className="inline">{formatDate(career.applicationDeadline)}</dd></div></dl>
            <Link href={`/careers/${career.slug}`} className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-[#c25541] transition-all hover:gap-3">View job details <span aria-hidden="true">→</span></Link>
          </article>)}
        </div>}
      </section>
    </main>
  );
}
