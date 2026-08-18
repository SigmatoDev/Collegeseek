"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";

const display = (value: unknown) => value === undefined || value === null || value === "" ? "-" : String(value);
const statuses = ["pending", "reviewing", "shortlisted", "rejected", "hired"];

export default function CareerApplicationDetails() {
  const { id } = useParams<{ id: string }>(); const router = useRouter();
  const [application, setApplication] = useState<any>(null); const [status, setStatus] = useState("pending"); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const headers = () => ({ Authorization: `Bearer ${sessionStorage.getItem("token") || ""}` });
  const load = async () => { try { setLoading(true); const { data } = await axios.get(`${api_url}admin/career-applications/${id}`, { headers: headers() }); setApplication(data.data); setStatus(data.data?.status || "pending"); } catch (error: any) { toast.error(error.response?.data?.message || "Failed to load career application."); } finally { setLoading(false); } };
  useEffect(() => { if (id) load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async () => { try { setSaving(true); await axios.patch(`${api_url}admin/career-applications/${id}/status`, { status }, { headers: headers() }); toast.success("Application status updated."); load(); } catch (error: any) { toast.error(error.response?.data?.message || "Failed to update status."); } finally { setSaving(false); } };
  if (loading) return <div className="p-6 text-gray-500">Loading career application...</div>;
  if (!application) return <div className="p-6 text-gray-500">Career application not found. <button onClick={() => router.back()} className="underline">Go back</button></div>;
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="mb-4 text-lg font-semibold text-gray-800">{title}</h2><div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">{children}</div></section>;
  const Item = ({ label, value }: { label: string; value: unknown }) => <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 break-words text-gray-800">{display(value)}</p></div>;
  return <div className="container mx-auto px-4 py-8"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-800">Career Application Details</h1><p className="text-sm text-gray-500">{application.fullName}</p></div><div className="flex gap-2"><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm">{statuses.map((item) => <option key={item} value={item} className="capitalize">{item}</option>)}</select><button disabled={saving} onClick={save} className="rounded-lg bg-[#441A6B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Update Status"}</button></div></div><div className="space-y-6"><Section title="Position"><Item label="Position" value={application.positionApplyingFor} /><Item label="Location" value={application.jobLocation} /><Item label="Employment type" value={application.employmentType} /><Item label="Submitted" value={new Date(application.createdAt).toLocaleString()} /></Section><Section title="Applicant"><Item label="Full name" value={application.fullName} /><Item label="Email" value={application.email} /><Item label="Phone" value={application.phone} /><Item label="Current location" value={application.currentLocation} /><Item label="Experience" value={application.yearsOfExperience} /><Item label="LinkedIn" value={application.linkedinProfile} /><Item label="Portfolio / GitHub" value={application.portfolioGithub} /></Section><Section title="Application"><div><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume</p><a href={application.resume?.path} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-semibold text-[#441A6B] underline">{application.resume?.originalName || "View resume"}</a></div><div className="md:col-span-2"><Item label="Cover letter" value={application.coverLetter} /></div><div className="md:col-span-2"><Item label="Additional comments" value={application.additionalComments} /></div></Section></div></div>;
}
