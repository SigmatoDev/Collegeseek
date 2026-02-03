"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";

  const emptyValue = (value: any) =>
    value === undefined || value === null || value === "" ? "-" : value;
  const formatDate = (value: any) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

const ApplicationDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const baseUrl = api_url.replace(/api\/?$/, "");

  const fetchApplication = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${api_url}/applications/${id}`);
      setData(response.data?.data || null);
      setStatus(response.data?.data?.status || "pending");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch application.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async () => {
    try {
      await axios.put(`${api_url}/applications/${id}`, { status });
      toast.success("Status updated.");
      fetchApplication();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading application...</div>;
  }

  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        Application not found. <button className="underline" onClick={() => router.back()}>Go back</button>
      </div>
    );
  }

  const fullName = `${data?.applicant?.firstName || ""} ${data?.applicant?.lastName || ""}`.trim();

  const FileLink = ({ label, file }: { label: string; file?: any }) => (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 p-3 text-sm">
      <div>
        <div className="font-semibold text-gray-700">{label}</div>
        <div className="text-xs text-gray-500">{file?.originalName || "Not uploaded"}</div>
      </div>
      {file?.path && (
        <a
          href={`${baseUrl}${file.path}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
        >
          View
        </a>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Application Details</h1>
          <p className="text-sm text-gray-500">{fullName || "Applicant"}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm"
          >
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={updateStatus}
            className="rounded-lg bg-[#441A6B] px-4 py-2 text-sm font-semibold text-white"
          >
            Update Status
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Registration</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>Form Name: {emptyValue(data.registration?.formName)}</div>
            <div>Registered Name: {emptyValue(data.registration?.registeredName)}</div>
            <div>Registered Email: {emptyValue(data.registration?.registeredEmail)}</div>
            <div>Registered Mobile: {emptyValue(data.registration?.registeredMobile)}</div>
            <div>Registered Country: {emptyValue(data.registration?.registeredCountry)}</div>
            <div>Registration Date: {formatDate(data.registration?.registrationDate)}</div>
            <div>Alternate Mobile: {emptyValue(data.registration?.alternateMobile)}</div>
            <div>Alternate Mobile No: {emptyValue(data.registration?.alternateMobileNo)}</div>
            <div>State: {emptyValue(data.registration?.state)}</div>
            <div>City: {emptyValue(data.registration?.city)}</div>
            <div>Course: {emptyValue(data.registration?.course)}</div>
            <div>Program: {emptyValue(data.registration?.program)}</div>
            <div>Specialization: {emptyValue(data.registration?.specialization)}</div>
            <div>Admission Intake: {emptyValue(data.registration?.admissionIntake)}</div>
            <div>Application No: {emptyValue(data.registration?.applicationNo)}</div>
            <div>Occupation: {emptyValue(data.registration?.occupation)}</div>
            <div>Relationship: {emptyValue(data.registration?.relationship)}</div>
            <div>Annual Income: {emptyValue(data.registration?.annualIncome)}</div>
            <div>Father Name: {emptyValue(data.registration?.fatherName)}</div>
            <div>School Name: {emptyValue(data.registration?.schoolName)}</div>
            <div>Category / Nationality: {emptyValue(data.registration?.categoryNationality)}</div>
            <div>Admission Owner: {emptyValue(data.registration?.admissionOwner)}</div>
            <div>Admission Category: {emptyValue(data.registration?.admissionCategory)}</div>
            <div>Withdrawal Docs Eligibility: {emptyValue(data.registration?.withdrawalDocsEligible)}</div>
            <div>Title: {emptyValue(data.registration?.title)}</div>
            <div>Referral Code: {emptyValue(data.registration?.referralCode)}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Applicant</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>Name: {emptyValue(fullName)}</div>
            <div>Email: {emptyValue(data.applicant?.email)}</div>
            <div>Mobile: {emptyValue(data.applicant?.mobile)}</div>
            <div>DOB: {formatDate(data.applicant?.dateOfBirth)}</div>
            <div>Gender: {emptyValue(data.applicant?.gender)}</div>
            <div>Place Of Birth: {emptyValue(data.applicant?.placeOfBirth)}</div>
            <div>Nationality/Category: {emptyValue(data.registration?.categoryNationality)}</div>
            <div>Passport Number: {emptyValue(data.applicant?.passportNumber)}</div>
            <div>Country Of Residence: {emptyValue(data.applicant?.countryOfResidence)}</div>
            <div>Title: {emptyValue(data.applicant?.title)}</div>
            <div>Middle Name: {emptyValue(data.applicant?.middleName)}</div>
            <div>Religion: {emptyValue(data.applicant?.religion)}</div>
            <div>Blood Group: {emptyValue(data.applicant?.bloodGroup)}</div>
            <div>Marital Status: {emptyValue(data.applicant?.maritalStatus)}</div>
            <div>Require Transport: {emptyValue(data.applicant?.requireTransport)}</div>
            <div>Require Hostel: {emptyValue(data.applicant?.requireHostel)}</div>
            <div>Room Type: {emptyValue(data.applicant?.roomType)}</div>
            <div>PWD: {emptyValue(data.applicant?.pwd)}</div>
            <div>Caste Category: {emptyValue(data.applicant?.casteCategory)}</div>
            <div>Aadhar Number: {emptyValue(data.applicant?.aadharNumber)}</div>
            <div>Applicable: {emptyValue(data.applicant?.applicable)}</div>
            <div>Country Of Birth: {emptyValue(data.applicant?.countryOfBirth)}</div>
            <div>VISA Type: {emptyValue(data.applicant?.visaType)}</div>
            <div>VISA Number: {emptyValue(data.applicant?.visaNumber)}</div>
            <div>VISA Duration: {emptyValue(data.applicant?.visaDuration)}</div>
            <div>Fee: {emptyValue(data.applicant?.fee)}</div>
            <div>Passport Country: {emptyValue(data.applicant?.passportCountry)}</div>
            <div>Passport Place Of Issue: {emptyValue(data.applicant?.passportPlaceOfIssue)}</div>
            <div>Passport Date Of Issue: {formatDate(data.applicant?.passportDateOfIssue)}</div>
            <div>Passport Date Of Expiry: {formatDate(data.applicant?.passportDateOfExpiry)}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Parents / Guardians</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>Father: {emptyValue(data.parents?.father?.name)}</div>
            <div>Father Mobile: {emptyValue(data.parents?.father?.mobile)}</div>
            <div>Father Email: {emptyValue(data.parents?.father?.email)}</div>
            <div>Father PAN: {emptyValue(data.parents?.father?.pan)}</div>
            <div>Father Occupation: {emptyValue(data.parents?.father?.occupation)}</div>
            <div>Father Designation: {emptyValue(data.parents?.father?.designation)}</div>
            <div>Mother: {emptyValue(data.parents?.mother?.name)}</div>
            <div>Mother Mobile: {emptyValue(data.parents?.mother?.mobile)}</div>
            <div>Mother Email: {emptyValue(data.parents?.mother?.email)}</div>
            <div>Mother PAN: {emptyValue(data.parents?.mother?.pan)}</div>
            <div>Mother Occupation: {emptyValue(data.parents?.mother?.occupation)}</div>
            <div>Mother Designation: {emptyValue(data.parents?.mother?.designation)}</div>
            <div>Guardian: {emptyValue(data.parents?.guardian?.name)}</div>
            <div>Guardian Mobile: {emptyValue(data.parents?.guardian?.mobile)}</div>
            <div>Guardian Email: {emptyValue(data.parents?.guardian?.email)}</div>
            <div>Guardian PAN: {emptyValue(data.parents?.guardian?.pan)}</div>
            <div>Guardian Occupation: {emptyValue(data.parents?.guardian?.occupation)}</div>
            <div>Guardian Designation: {emptyValue(data.parents?.guardian?.designation)}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Addresses</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>Communication Address: {emptyValue(data.addresses?.communication?.addressLine1)}</div>
            <div>City: {emptyValue(data.addresses?.communication?.city)}</div>
            <div>State: {emptyValue(data.addresses?.communication?.state)}</div>
            <div>Pincode: {emptyValue(data.addresses?.communication?.pincode)}</div>
            <div>Country: {emptyValue(data.addresses?.communication?.country)}</div>
            <div>District: {emptyValue(data.addresses?.communication?.district)}</div>
            <div>Address Line 2: {emptyValue(data.addresses?.communication?.addressLine2)}</div>
            <div>Permanent Address: {emptyValue(data.addresses?.permanent?.addressLine1)}</div>
            <div>Permanent City: {emptyValue(data.addresses?.permanent?.city)}</div>
            <div>Permanent State: {emptyValue(data.addresses?.permanent?.state)}</div>
            <div>Permanent Pincode: {emptyValue(data.addresses?.permanent?.pincode)}</div>
            <div>Permanent Country: {emptyValue(data.addresses?.permanent?.country)}</div>
            <div>Permanent District: {emptyValue(data.addresses?.permanent?.district)}</div>
            <div>Permanent Address Line 2: {emptyValue(data.addresses?.permanent?.addressLine2)}</div>
            <div>Permanent Same As Communication: {data.addresses?.permanentSameAsCommunication ? "Yes" : "No"}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Education Summary</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>10th Institute: {emptyValue(data.education?.tenth?.instituteName)}</div>
            <div>10th Board: {emptyValue(data.education?.tenth?.board)}</div>
            <div>10th Percentage: {emptyValue(data.education?.tenth?.percentage)}</div>
            <div>10th Roll No: {emptyValue(data.education?.tenth?.rollNo)}</div>
            <div>10th Year: {emptyValue(data.education?.tenth?.yearOfPassing)}</div>
            <div>10th Marking Scheme: {emptyValue(data.education?.tenth?.markingScheme)}</div>
            <div>Studied Kannada: {emptyValue(data.education?.tenth?.studiedKannada)}</div>
            <div>Studied Up To 10th: {emptyValue(data.education?.tenth?.studiedUpTo10th)}</div>
            <div>Studied Up To 12th: {emptyValue(data.education?.tenth?.studiedUpTo12th)}</div>
            <div>After 10th Qualification: {emptyValue(data.education?.tenth?.after10thQualification)}</div>
            <div>12th Institute: {emptyValue(data.education?.twelfth?.instituteNameWithBranch)}</div>
            <div>12th Percentage: {emptyValue(data.education?.twelfth?.percentage)}</div>
            <div>12th Board: {emptyValue(data.education?.twelfth?.board)}</div>
            <div>12th Stream: {emptyValue(data.education?.twelfth?.stream)}</div>
            <div>12th Year: {emptyValue(data.education?.twelfth?.yearOfPassing)}</div>
            <div>12th Result Status: {emptyValue(data.education?.twelfth?.resultStatus)}</div>
            <div>12th Roll No: {emptyValue(data.education?.twelfth?.rollNo)}</div>
            <div>UG Institute: {emptyValue(data.education?.ug?.institute)}</div>
            <div>UG University: {emptyValue(data.education?.ug?.university)}</div>
            <div>UG Result Status: {emptyValue(data.education?.ug?.resultStatus)}</div>
            <div>UG Year: {emptyValue(data.education?.ug?.yearOfPassing)}</div>
            <div>UG Total Marks: {emptyValue(data.education?.ug?.totalMarks)}</div>
            <div>UG Marks Obtained: {emptyValue(data.education?.ug?.marksObtained)}</div>
            <div>UG Overall Percentage: {emptyValue(data.education?.ug?.overallPercentage)}</div>
            <div>Diploma Institute: {emptyValue(data.education?.diploma?.instituteNameWithBranch)}</div>
            <div>Diploma Board/University: {emptyValue(data.education?.diploma?.boardOrUniversity)}</div>
            <div>Diploma Stream: {emptyValue(data.education?.diploma?.stream)}</div>
            <div>Diploma Year: {emptyValue(data.education?.diploma?.yearOfPassing)}</div>
            <div>Diploma Result Status: {emptyValue(data.education?.diploma?.resultStatus)}</div>
            <div>Diploma Percentage: {emptyValue(data.education?.diploma?.percentage)}</div>
            <div>Other Qualification: {emptyValue(data.education?.others?.degree)}</div>
            <div>Other Institute: {emptyValue(data.education?.others?.instituteName)}</div>
            <div>Other University: {emptyValue(data.education?.others?.university)}</div>
            <div>Other Year: {emptyValue(data.education?.others?.yearOfPassing)}</div>
            <div>Other Result Status: {emptyValue(data.education?.others?.resultStatus)}</div>
            <div>Other Percentage: {emptyValue(data.education?.others?.percentage)}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Uploads</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FileLink label="Passport Size Photo" file={data.uploads?.photo} />
            <FileLink label="Signature" file={data.uploads?.signature} />
            <FileLink label="Diploma Certificate" file={data.uploads?.diplomaCertificate} />
            <FileLink label="Bachelor Certificate" file={data.uploads?.bachelorCertificate} />
            <FileLink label="Master Certificate" file={data.uploads?.masterCertificate} />
            <FileLink label="Other Qualification" file={data.uploads?.otherQualificationCertificate} />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Declaration</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>Applicant Name: {emptyValue(data.declaration?.applicantName)}</div>
            <div>Parent Name: {emptyValue(data.declaration?.parentName)}</div>
            <div>Date: {formatDate(data.declaration?.date)}</div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ApplicationDetails;
