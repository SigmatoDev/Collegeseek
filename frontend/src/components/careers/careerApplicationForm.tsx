"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";
import { useUserStore } from "@/Store/userStore";

type Career = { _id: string; title: string; slug: string; location: string; employmentType: string; applicationDeadline: string };
type FormDataState = { fullName: string; email: string; phone: string; currentLocation: string; yearsOfExperience: string; coverLetter: string; linkedinProfile: string; portfolioGithub: string; additionalComments: string };
const initialForm: FormDataState = { fullName: "", email: "", phone: "", currentLocation: "", yearsOfExperience: "", coverLetter: "", linkedinProfile: "", portfolioGithub: "", additionalComments: "" };

export default function CareerApplicationForm() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, token, isLoggedIn, isHydrated } = useUserStore();
  const [career, setCareer] = useState<Career | null>(null);
  const [form, setForm] = useState<FormDataState>(initialForm);
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    const applyPath = `/careers/${params.slug}/apply`;
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", applyPath);
      router.replace("/user/auth/logIn");
      return;
    }
    setForm((current) => ({ ...current, fullName: current.fullName || user?.name || "", email: current.email || user?.email || "", phone: current.phone || user?.phone || "" }));
    axios.get(`${api_url}careers/by/slug?slug=${encodeURIComponent(params.slug)}`)
      .then(({ data }) => setCareer(data.data || null))
      .catch(() => toast.error("This job is no longer available."))
      .finally(() => setLoading(false));
  }, [isHydrated, isLoggedIn, params.slug, router, user]);

  const setValue = (key: keyof FormDataState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!career || !resume) { toast.error("Please complete the required fields and attach your resume."); return; }
    if (resume.size > 10 * 1024 * 1024) { toast.error("Resume must be 10 MB or smaller."); return; }
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(resume.type)) { toast.error("Resume must be a PDF, DOC, or DOCX file."); return; }
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries({ ...form, careerId: career._id }).forEach(([key, value]) => payload.append(key, value));
      payload.append("resume", resume);
      await axios.post(`${api_url}career-applications`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Your application has been submitted.");
      router.replace("/careers");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to submit your application.");
    } finally { setSubmitting(false); }
  };

  if (!isHydrated || loading) return <main className="min-h-[55vh] bg-[#f9f9f7] py-14 text-center text-sm text-gray-500">Loading application form...</main>;
  if (!career) return <main className="min-h-[55vh] bg-[#f9f9f7] py-14 text-center"><p className="text-gray-600">This job is no longer available.</p><button onClick={() => router.push("/careers")} className="mt-4 text-sm font-semibold text-[#2d2d5a] underline">Back to careers</button></main>;

  return <main className="bg-[#f9f9f7] py-7 sm:py-10">
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <a href={`/careers/${career.slug}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2d2d5a] hover:text-[#c8102e] hover:underline">← Back to job details</a>
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(62,44,92,0.10)]">
        <header className="bg-[#2d2d5a] px-6 py-8 text-white sm:px-9">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Career application</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Apply for {career.title}</h1>
          <p className="mt-2 text-sm text-white/80">{career.location} · {career.employmentType.replace("-", " ")}</p>
        </header>
        <form onSubmit={submit} className="grid gap-5 p-6 sm:grid-cols-2 sm:p-9">
          <Field label="Full name" value={form.fullName} onChange={(value) => setValue("fullName", value)} required />
            <Field label="Email address" type="email" value={form.email} onChange={(value) => setValue("email", value)} required />
            <Field label="Phone number" value={form.phone} onChange={(value) => setValue("phone", value)} required />
            <Field label="Current location" value={form.currentLocation} onChange={(value) => setValue("currentLocation", value)} required />
            <Field label="Years of experience" value={form.yearsOfExperience} onChange={(value) => setValue("yearsOfExperience", value)} placeholder="e.g. 3 years" required />
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Resume <span className="text-[#c8102e]">*</span></label>
            <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setResume(event.target.files?.[0] || null)} required className="block w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600" /><p className="mt-1 text-xs text-gray-500">PDF, DOC, or DOCX up to 10 MB.</p></div><ReadOnly label="Position applying for" value={career.title} /><Field label="LinkedIn profile" type="url" value={form.linkedinProfile} onChange={(value) => setValue("linkedinProfile", value)} placeholder="https://linkedin.com/in/..." /><Field label="Portfolio / GitHub" type="url" value={form.portfolioGithub} onChange={(value) => setValue("portfolioGithub", value)} placeholder="https://..." /><TextArea label="Cover letter" value={form.coverLetter} onChange={(value) => setValue("coverLetter", value)} /><TextArea label="Additional comments" value={form.additionalComments} onChange={(value) => setValue("additionalComments", value)} /><div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5"><p className="text-xs text-gray-500">Your application will be reviewed by the CollegeSeek team.</p><button disabled={submitting} className="rounded-lg bg-[#fd4c00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a50d26] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting..." : "Submit application"}</button></div></form></div></div></main>;
}

function Field({ label, value, onChange, type = "text", placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) { return <label className="block text-sm font-semibold text-gray-700">{label} {required && <span className="text-[#c8102e]">*</span>}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-800 shadow-sm outline-none focus:border-[#2d2d5a]" /></label>; }
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-gray-700">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="mt-1.5 block w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-800 shadow-sm outline-none focus:border-[#2d2d5a]" /></label>; }
function ReadOnly({ label, value }: { label: string; value: string }) { return <label className="block text-sm font-semibold text-gray-700">{label}<input value={value} readOnly className="mt-1.5 block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal text-gray-600" /></label>; }
