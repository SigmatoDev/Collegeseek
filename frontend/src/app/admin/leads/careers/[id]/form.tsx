"use client";

import { FormEvent, InputHTMLAttributes, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

type CareerFormData = {
  title: string; location: string; employmentType: string; experienceRequired: string; salary: string;
  description: string; responsibilities: string; skillsAndQualifications: string; benefits: string;
  applicationDeadline: string; isPublished: boolean; metaTitle: string; metaDescription: string;
};

const initialData: CareerFormData = { title: "", location: "", employmentType: "full-time", experienceRequired: "", salary: "", description: "", responsibilities: "", skillsAndQualifications: "", benefits: "", applicationDeadline: "", isPublished: false, metaTitle: "", metaDescription: "" };
const authHeaders = () => { const token = sessionStorage.getItem("token"); return token ? { Authorization: `Bearer ${token}` } : {}; };

export default function CareerForm() {
  const router = useRouter();
  const params = useParams();
  const careerId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = Boolean(careerId && careerId !== "new");
  const [form, setForm] = useState<CareerFormData>(initialData);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const fetchCareer = async () => {
      try {
        const { data } = await axios.get(`${api_url}admin/careers/${careerId}`, { headers: authHeaders() });
        const career = data.data;
        setForm({ ...initialData, ...career, applicationDeadline: career.applicationDeadline ? new Date(career.applicationDeadline).toISOString().slice(0, 10) : "" });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load job.");
      } finally { setLoading(false); }
    };
    fetchCareer();
  }, [careerId, isEdit]);

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const response = isEdit
        ? await axios.put(`${api_url}admin/careers/${careerId}`, form, { headers: authHeaders() })
        : await axios.post(`${api_url}admin/careers`, form, { headers: authHeaders() });
      if ([200, 201].includes(response.status)) { toast.success(isEdit ? "Job updated successfully." : "Job created successfully."); router.push("/admin/leads/careers"); }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to save job.";
      setError(message); toast.error(message);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader className="h-10 w-10 animate-spin text-blue-600" /></div>;

  const textAreas: Array<[keyof CareerFormData, string, boolean]> = [
    ["description", "Job Description", true], ["responsibilities", "Key Responsibilities", true], ["skillsAndQualifications", "Required Skills & Qualifications", true], ["benefits", "Benefits", true], ["metaDescription", "Meta Description", false],
  ];
  return <div className="mx-auto max-w-6xl px-4 py-8">
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{isEdit ? "Edit Job" : "Add Job"}</h1>
      <p className="mb-6 text-sm text-gray-500">Fields marked with an asterisk are required.</p>
      {error ? <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Job Title" name="title" value={form.title} onChange={change} required />
          <Field label="Job Location" name="location" value={form.location} onChange={change} required />
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Employment Type *</label><select name="employmentType" value={form.employmentType} onChange={change} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" required><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option></select></div>
          <Field label="Experience Required" name="experienceRequired" value={form.experienceRequired} onChange={change} required />
          <Field label="Salary" name="salary" value={form.salary} onChange={change} />
          <Field label="Application Deadline" name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={change} required />
        </div>
        {textAreas.slice(0, 4).map(([name, label, required]) => <div key={name}><label className="mb-1 block text-sm font-medium text-gray-700">{label} {required ? "*" : ""}</label><textarea name={name} value={form[name] as string} onChange={change} rows={6} required={required} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm leading-6 focus:border-blue-500 focus:outline-none" /></div>)}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5"><h2 className="mb-4 text-lg font-semibold text-gray-800">SEO Metadata</h2><div className="grid gap-5 md:grid-cols-2"><Field label="Meta Title" name="metaTitle" value={form.metaTitle} onChange={change} /><div className="md:col-span-2"><label className="mb-1 block text-sm font-medium text-gray-700">Meta Description</label><textarea name="metaDescription" value={form.metaDescription} onChange={change} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" /></div></div></div>
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm text-gray-700"><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={change} className="h-4 w-4 accent-blue-600" /> Publish this job immediately</label>
        <div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : isEdit ? "Update Job" : "Create Job"}</button><button type="button" onClick={() => router.push("/admin/leads/careers")} className="rounded-lg bg-gray-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-600">Cancel</button></div>
      </form>
    </div>
  </div>;
}

function Field({ label, required = false, ...props }: { label: string; required?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return <div><label className="mb-1 block text-sm font-medium text-gray-700">{label} {required ? "*" : ""}</label><input {...props} required={required} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" /></div>;
}
