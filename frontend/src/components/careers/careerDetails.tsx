export type CareerDetail = {
  _id: string;
  slug: string;
  title: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  salary?: string;
  description: string;
  responsibilities: string;
  skillsAndQualifications: string;
  benefits: string;
  applicationDeadline: string;
};

import CareerApplyButton from "./careerApplyButton";

const formatDate = (value: string) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function CareerDetails({ career }: { career: CareerDetail }) {
  return <main className="min-h-screen bg-[#f9f9f7] py-5 sm:py-8"><div className="mx-auto max-w-6xl px-5 sm:px-8">
    <a href="/careers" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2d2d5a] hover:text-[#c8102e] hover:underline">← Back to careers</a>
    <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(62,44,92,0.10)]"><header className="relative overflow-hidden bg-[#2d2d5a] px-6 pb-9 pt-10 text-white sm:px-9 sm:pt-14"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_70%,rgba(180,90,75,0.3),transparent_55%),radial-gradient(ellipse_at_90%_20%,rgba(60,45,105,0.75),transparent_60%)]" /><div className="relative"><span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65"><span className="h-px w-6 bg-white/60" />Career opportunity</span><h1 className="mt-5 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">{career.title}</h1><div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white/10 px-3 py-1.5 font-medium text-white">{career.location}</span><span className="rounded-full bg-white/10 px-3 py-1.5 font-medium capitalize text-white">{career.employmentType.replace("-", " ")}</span><span className="rounded-full bg-white/10 px-3 py-1.5 font-medium text-white">{career.experienceRequired}</span></div></div></header><div className="p-6 sm:p-9">
        <Content title="Job Description" value={career.description} /><Content title="Key Responsibilities" value={career.responsibilities} /><Content title="Required Skills & Qualifications" value={career.skillsAndQualifications} /><Content title="Benefits" value={career.benefits} />
      </div></article>
      <aside className="h-fit rounded-xl border border-gray-100 bg-white p-6 shadow-[0_12px_35px_rgba(62,44,92,0.10)] lg:sticky lg:top-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <span className="h-[2px] w-7 bg-[#c8102e]" />
          <h2 className="text-lg font-bold text-gray-900">Job overview</h2>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          <Info label="Location" value={career.location} />
          <Info label="Employment type" value={career.employmentType.replace("-", " ")} />
          <Info label="Experience" value={career.experienceRequired} />
          {career.salary ? <Info label="Salary" value={career.salary} /> : null}
          <Info label="Application deadline" value={formatDate(career.applicationDeadline)} />
        </dl>
        <CareerApplyButton slug={career.slug} />
        <p className="mt-3 text-center text-xs text-gray-500">Sign in to submit your application.</p>
      </aside>
    </div>
  </div></main>;
}

function Content({ title, value }: { title: string; value: string }) { return <section className="mt-9 border-t border-[#e3e3de] pt-8"><h2 className="text-xl font-bold tracking-[-0.015em] text-gray-900">{title}</h2><div className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">{value}</div></section>; }
function Info({ label, value }: { label: string; value: string }) { return <div><dt className="font-medium capitalize text-gray-500">{label}</dt><dd className="mt-1 text-gray-800">{value}</dd></div>; }
