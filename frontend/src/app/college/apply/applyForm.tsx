"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "college_apply_draft_v1";
const STORAGE_STEP_KEY = "college_apply_step_v1";

type FileMap = Record<string, File | null>;

type ApplicationForm = {
  collegeSlug: string;
  registration: {
    formName: string;
    registeredName: string;
    registeredEmail: string;
    registrationDate: string;
    registeredMobile: string;
    registeredCountry: string;
    alternateMobile: string;
    alternateMobileNo: string;
    state: string;
    city: string;
    course: string;
    admissionIntake: string;
    occupation: string;
    relationship: string;
    annualIncome: string;
    fatherName: string;
    applicationNo: string;
    program: string;
    specialization: string;
    schoolName: string;
    categoryNationality: string;
    admissionOwner: string;
    admissionCategory: string;
    withdrawalDocsEligible: string;
    title: string;
    referralCode: string;
  };
  applicant: {
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    gender: string;
    placeOfBirth: string;
    religion: string;
    bloodGroup: string;
    maritalStatus: string;
    requireTransport: string;
    requireHostel: string;
    roomType: string;
    pwd: string;
    casteCategory: string;
    aadharNumber: string;
    applicable: string;
    countryOfBirth: string;
    visaType: string;
    visaNumber: string;
    visaDuration: string;
    fee: string;
    countryOfResidence: string;
    passportNumber: string;
    passportCountry: string;
    passportPlaceOfIssue: string;
    passportDateOfIssue: string;
    passportDateOfExpiry: string;
  };
  parents: {
    father: {
      name: string;
      email: string;
      mobile: string;
      pan: string;
      occupation: string;
      designation: string;
    };
    mother: {
      name: string;
      email: string;
      mobile: string;
      pan: string;
      occupation: string;
      designation: string;
    };
    guardian: {
      name: string;
      email: string;
      mobile: string;
      pan: string;
      occupation: string;
      designation: string;
    };
  };
  addresses: {
    communication: {
      country: string;
      state: string;
      district: string;
      city: string;
      addressLine1: string;
      addressLine2: string;
      pincode: string;
    };
    permanent: {
      country: string;
      state: string;
      district: string;
      city: string;
      addressLine1: string;
      addressLine2: string;
      pincode: string;
    };
    permanentSameAsCommunication: boolean;
  };
  education: {
    tenth: {
      instituteName: string;
      board: string;
      rollNo: string;
      yearOfPassing: string;
      percentage: string;
      markingScheme: string;
      studiedKannada: string;
      studiedUpTo10th: string;
      studiedUpTo12th: string;
      after10thQualification: string;
    };
    twelfth: {
      instituteNameWithBranch: string;
      board: string;
      rollNo: string;
      stream: string;
      yearOfPassing: string;
      resultStatus: string;
      percentage: string;
      subjects: {
        subject: string;
        maxMarks: string;
        obtainedMarks: string;
        percentage: string;
      }[];
      totals: {
        totalSubjects: string;
        totalMaxMarks: string;
        totalObtainedMarks: string;
        totalPercentage: string;
      };
    };
    diploma: {
      instituteNameWithBranch: string;
      boardOrUniversity: string;
      rollNo: string;
      stream: string;
      yearOfPassing: string;
      resultStatus: string;
      percentage: string;
    };
    ug: {
      resultStatus: string;
      institute: string;
      university: string;
      registerNumber: string;
      yearOfPassing: string;
      totalMarks: string;
      marksObtained: string;
      overallPercentage: string;
      subjects: {
        subject: string;
        maxMarks: string;
        obtainedMarks: string;
        percentageOrGrade: string;
      }[];
      totals: {
        totalSubjects: string;
        totalMaxMarks: string;
        totalObtainedMarks: string;
        totalPercentage: string;
      };
    };
    others: {
      instituteName: string;
      university: string;
      degree: string;
      yearOfPassing: string;
      resultStatus: string;
      percentage: string;
    };
    international: {
      oLevel: {
        instituteName: string;
        board: string;
        certificateName: string;
        yearOfPassing: string;
        marksScore: string;
        gpaGradePercentage: string;
      };
      aLevel: {
        instituteName: string;
        board: string;
        certificateName: string;
        yearOfPassing: string;
        marksScore: string;
        gpaGradePercentage: string;
      };
      diplomaCertificate: {
        instituteName: string;
        board: string;
        certificateName: string;
        yearOfPassing: string;
        marksScore: string;
        gpaGradePercentage: string;
      };
      bachelors: {
        instituteName: string;
        board: string;
        certificateName: string;
        yearOfPassing: string;
        marksScore: string;
        gpaGradePercentage: string;
      };
      masters: {
        instituteName: string;
        board: string;
        certificateName: string;
        yearOfPassing: string;
        marksScore: string;
        gpaGradePercentage: string;
      };
      otherQualification: {
        instituteName: string;
        board: string;
        certificateName: string;
        yearOfPassing: string;
        marksScore: string;
        gpaGradePercentage: string;
      };
    };
    entranceExams: {
      appeared: string;
      exams: {
        name: string;
        rollNo: string;
        year: string;
        resultStatus: string;
        score: string;
        rank: string;
      }[];
    };
  };
  declaration: {
    applicantName: string;
    parentName: string;
    date: string;
  };
};

const emptySubject = () => ({ subject: "", maxMarks: "", obtainedMarks: "", percentage: "" });
const emptyUGSubject = () => ({ subject: "", maxMarks: "", obtainedMarks: "", percentageOrGrade: "" });

const initialData: ApplicationForm = {
  collegeSlug: "",
  registration: {
    formName: "",
    registeredName: "",
    registeredEmail: "",
    registrationDate: "",
    registeredMobile: "",
    registeredCountry: "",
    alternateMobile: "",
    alternateMobileNo: "",
    state: "",
    city: "",
    course: "",
    admissionIntake: "",
    occupation: "",
    relationship: "",
    annualIncome: "",
    fatherName: "",
    applicationNo: "",
    program: "",
    specialization: "",
    schoolName: "",
    categoryNationality: "",
    admissionOwner: "",
    admissionCategory: "",
    withdrawalDocsEligible: "",
    title: "",
    referralCode: "",
  },
  applicant: {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    placeOfBirth: "",
    religion: "",
    bloodGroup: "",
    maritalStatus: "",
    requireTransport: "",
    requireHostel: "",
    roomType: "",
    pwd: "",
    casteCategory: "",
    aadharNumber: "",
    applicable: "",
    countryOfBirth: "",
    visaType: "",
    visaNumber: "",
    visaDuration: "",
    fee: "",
    countryOfResidence: "",
    passportNumber: "",
    passportCountry: "",
    passportPlaceOfIssue: "",
    passportDateOfIssue: "",
    passportDateOfExpiry: "",
  },
  parents: {
    father: { name: "", email: "", mobile: "", pan: "", occupation: "", designation: "" },
    mother: { name: "", email: "", mobile: "", pan: "", occupation: "", designation: "" },
    guardian: { name: "", email: "", mobile: "", pan: "", occupation: "", designation: "" },
  },
  addresses: {
    communication: {
      country: "",
      state: "",
      district: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
    },
    permanent: {
      country: "",
      state: "",
      district: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
    },
    permanentSameAsCommunication: false,
  },
  education: {
    tenth: {
      instituteName: "",
      board: "",
      rollNo: "",
      yearOfPassing: "",
      percentage: "",
      markingScheme: "",
      studiedKannada: "",
      studiedUpTo10th: "",
      studiedUpTo12th: "",
      after10thQualification: "",
    },
    twelfth: {
      instituteNameWithBranch: "",
      board: "",
      rollNo: "",
      stream: "",
      yearOfPassing: "",
      resultStatus: "",
      percentage: "",
      subjects: [emptySubject(), emptySubject(), emptySubject(), emptySubject(), emptySubject()],
      totals: { totalSubjects: "", totalMaxMarks: "", totalObtainedMarks: "", totalPercentage: "" },
    },
    diploma: {
      instituteNameWithBranch: "",
      boardOrUniversity: "",
      rollNo: "",
      stream: "",
      yearOfPassing: "",
      resultStatus: "",
      percentage: "",
    },
    ug: {
      resultStatus: "",
      institute: "",
      university: "",
      registerNumber: "",
      yearOfPassing: "",
      totalMarks: "",
      marksObtained: "",
      overallPercentage: "",
      subjects: [
        emptyUGSubject(),
        emptyUGSubject(),
        emptyUGSubject(),
        emptyUGSubject(),
        emptyUGSubject(),
        emptyUGSubject(),
        emptyUGSubject(),
        emptyUGSubject(),
      ],
      totals: { totalSubjects: "", totalMaxMarks: "", totalObtainedMarks: "", totalPercentage: "" },
    },
    others: {
      instituteName: "",
      university: "",
      degree: "",
      yearOfPassing: "",
      resultStatus: "",
      percentage: "",
    },
    international: {
      oLevel: { instituteName: "", board: "", certificateName: "", yearOfPassing: "", marksScore: "", gpaGradePercentage: "" },
      aLevel: { instituteName: "", board: "", certificateName: "", yearOfPassing: "", marksScore: "", gpaGradePercentage: "" },
      diplomaCertificate: { instituteName: "", board: "", certificateName: "", yearOfPassing: "", marksScore: "", gpaGradePercentage: "" },
      bachelors: { instituteName: "", board: "", certificateName: "", yearOfPassing: "", marksScore: "", gpaGradePercentage: "" },
      masters: { instituteName: "", board: "", certificateName: "", yearOfPassing: "", marksScore: "", gpaGradePercentage: "" },
      otherQualification: { instituteName: "", board: "", certificateName: "", yearOfPassing: "", marksScore: "", gpaGradePercentage: "" },
    },
    entranceExams: {
      appeared: "",
      exams: [
        { name: "", rollNo: "", year: "", resultStatus: "", score: "", rank: "" },
        { name: "", rollNo: "", year: "", resultStatus: "", score: "", rank: "" },
      ],
    },
  },
  declaration: {
    applicantName: "",
    parentName: "",
    date: "",
  },
};

const stepTitles = [
  "Registration & Admission",
  "Applicant Details",
  "Parents & Address",
  "Education",
  "Uploads & Declaration",
];

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open("college_apply_files", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const idbSet = async (key: string, value: Blob | null) => {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    if (value) {
      store.put(value, key);
    } else {
      store.delete(key);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const idbGet = async (key: string): Promise<Blob | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const req = store.get(key);
    req.onsuccess = () => resolve((req.result as Blob) || null);
    req.onerror = () => reject(req.error);
  });
};

const idbClear = async () => {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

const setByPath = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  target[lastKey] = value;
};

export default function ApplyForm() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationForm>(initialData);
  const [files, setFiles] = useState<FileMap>({
    photo: null,
    signature: null,
    diplomaCertificate: null,
    bachelorCertificate: null,
    masterCertificate: null,
    otherQualificationCertificate: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const savedStep = typeof window !== "undefined" ? localStorage.getItem(STORAGE_STEP_KEY) : null;
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        setFormData(initialData);
      }
    }
    if (savedStep) {
      const stepNum = Number(savedStep);
      if (stepNum >= 1 && stepNum <= 5) setCurrentStep(stepNum);
    }
  }, []);

  useEffect(() => {
    const slug = searchParams.get("college") || "";
    if (slug) {
      setFormData((prev) => ({ ...prev, collegeSlug: slug }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_STEP_KEY, String(currentStep));
    }, 300);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [formData, currentStep]);

  useEffect(() => {
    const loadFiles = async () => {
      const keys = Object.keys(files);
      const nextFiles: FileMap = { ...files };
      for (const key of keys) {
        const blob = await idbGet(key);
        if (blob) {
          nextFiles[key] = new File([blob], blob.name || key, { type: blob.type });
        }
      }
      setFiles(nextFiles);
    };
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (path: string, value: any) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const next: any = Array.isArray(prev) ? [...(prev as any)] : { ...prev };
      let cursor: any = next;
      let prevCursor: any = prev as any;
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const isLast = i === keys.length - 1;
        if (isLast) {
          cursor[key] = value;
        } else {
          const prevVal = prevCursor?.[key];
          const cloned =
            Array.isArray(prevVal) ? [...prevVal] : { ...(prevVal || {}) };
          cursor[key] = cloned;
          cursor = cloned;
          prevCursor = prevVal || {};
        }
      }
      return next;
    });
  };

  const clearFieldError = (path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const handleFileChange = async (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    await idbSet(key, file);
  };

  const stepErrors = useMemo(() => errors, [errors]);

  const validateStep = (step: number) => {
    const nextErrors: Record<string, string> = {};
    const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
    if (step === 1) {
      const required = [
        ["registration.formName", "Form name is required"],
        ["registration.registeredName", "Registered name is required"],
        ["registration.registeredEmail", "Registered email is required"],
        ["registration.registrationDate", "Registration date is required"],
        ["registration.registeredMobile", "Registered mobile is required"],
        ["registration.registeredCountry", "Registered country is required"],
        ["registration.admissionIntake", "Admission intake is required"],
      ];
      required.forEach(([path, message]) => {
        const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (!formData.registration.course && !formData.registration.program) {
        nextErrors["registration.course"] = "Course or Program is required";
      }
      if (
        formData.registration.registeredEmail &&
        !isEmail(formData.registration.registeredEmail)
      ) {
        nextErrors["registration.registeredEmail"] = "Invalid email address";
      }
    }
    if (step === 2) {
      const required = [
        ["applicant.firstName", "First name is required"],
        ["applicant.lastName", "Last name is required"],
        ["applicant.email", "Email is required"],
        ["applicant.mobile", "Mobile number is required"],
        ["applicant.dateOfBirth", "Date of birth is required"],
        ["applicant.gender", "Gender is required"],
      ];
      required.forEach(([path, message]) => {
        const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (formData.applicant.email && !isEmail(formData.applicant.email)) {
        nextErrors["applicant.email"] = "Invalid email address";
      }
    }
    if (step === 3) {
      const required = [
        ["parents.father.name", "Father's name is required"],
        ["parents.father.mobile", "Father's mobile is required"],
        ["addresses.communication.addressLine1", "Address line 1 is required"],
        ["addresses.communication.city", "City is required"],
        ["addresses.communication.state", "State is required"],
        ["addresses.communication.pincode", "Pincode is required"],
        ["addresses.communication.country", "Country is required"],
      ];
      required.forEach(([path, message]) => {
        const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (!formData.addresses.permanentSameAsCommunication) {
        const permRequired = [
          ["addresses.permanent.addressLine1", "Permanent address line 1 is required"],
          ["addresses.permanent.city", "Permanent city is required"],
          ["addresses.permanent.state", "Permanent state is required"],
          ["addresses.permanent.pincode", "Permanent pincode is required"],
          ["addresses.permanent.country", "Permanent country is required"],
        ];
        permRequired.forEach(([path, message]) => {
          const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
          if (!value) nextErrors[path] = message;
        });
      }
    }
    if (step === 4) {
      const required = [
        ["education.tenth.instituteName", "10th institute name is required"],
        ["education.tenth.board", "10th board is required"],
        ["education.tenth.yearOfPassing", "10th year of passing is required"],
        ["education.tenth.percentage", "10th percentage is required"],
      ];
      required.forEach(([path, message]) => {
        const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (formData.education.tenth.studiedUpTo12th === "Yes") {
        const req12 = [
          ["education.twelfth.instituteNameWithBranch", "12th institute name is required"],
          ["education.twelfth.board", "12th board is required"],
          ["education.twelfth.yearOfPassing", "12th year of passing is required"],
          ["education.twelfth.percentage", "12th percentage is required"],
        ];
        req12.forEach(([path, message]) => {
          const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
          if (!value) nextErrors[path] = message;
        });
      }
    }
    if (step === 5) {
      const required = [
        ["declaration.applicantName", "Applicant name is required"],
        ["declaration.parentName", "Parent name is required"],
        ["declaration.date", "Declaration date is required"],
      ];
      required.forEach(([path, message]) => {
        const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (!files.photo) nextErrors["uploads.photo"] = "Photo is required";
      if (!files.signature) nextErrors["uploads.signature"] = "Signature is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const goBack = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    for (let step = 1; step <= 5; step += 1) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        toast.error("Please complete the required fields before submitting.");
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("data", JSON.stringify(formData));
      Object.entries(files).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      await axios.post(`${api_url}/applications`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully!");
      setFormData(initialData);
      setFiles({
        photo: null,
        signature: null,
        diplomaCertificate: null,
        bachelorCertificate: null,
        masterCertificate: null,
        otherQualificationCertificate: null,
      });
      setErrors({});
      setCurrentStep(1);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
      await idbClear();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const StepHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const Input = ({
    label,
    path,
    type = "text",
    required,
    placeholder,
  }: {
    label: string;
    path: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => {
    const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData) ?? "";
    const error = stepErrors[path];
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => {
            updateField(path, e.target.value);
            clearFieldError(path);
          }}
          placeholder={placeholder}
          className={`rounded-lg border px-3 py-2 text-sm focus:outline-none ${
            error ? "border-red-400" : "border-gray-200"
          }`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </label>
    );
  };

  const Select = ({
    label,
    path,
    options,
    required,
  }: {
    label: string;
    path: string;
    options: string[];
    required?: boolean;
  }) => {
    const value = path.split(".").reduce((acc: any, key: string) => acc?.[key], formData) ?? "";
    const error = stepErrors[path];
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <select
          value={value}
          onChange={(e) => {
            updateField(path, e.target.value);
            clearFieldError(path);
          }}
          className={`rounded-lg border px-3 py-2 text-sm focus:outline-none ${
            error ? "border-red-400" : "border-gray-200"
          }`}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </label>
    );
  };

  const FileInput = ({ label, fileKey, accept }: { label: string; fileKey: string; accept: string }) => {
    const error = stepErrors[`uploads.${fileKey}`];
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(fileKey, e.target.files?.[0] || null)}
          className={`rounded-lg border px-3 py-2 text-sm ${error ? "border-red-400" : "border-gray-200"}`}
        />
        {files[fileKey] && (
          <span className="text-xs text-gray-500">Selected: {files[fileKey]?.name}</span>
        )}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </label>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Application Form</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete the 5-step application. Your progress is saved automatically.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
          {stepTitles.map((title, idx) => {
            const stepNumber = idx + 1;
            const active = stepNumber === currentStep;
            return (
              <div
                key={title}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                  active ? "border-[#7a6be7] bg-[#f6f5ff] text-[#44368a]" : "border-gray-200 text-gray-500"
                }`}
              >
                <div className="text-[10px] uppercase">Step {stepNumber}</div>
                <div>{title}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <StepHeader title="Registration & Admission" subtitle="Provide registration and admission details." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input label="Form Name" path="registration.formName" required />
              <Input label="Registered Name" path="registration.registeredName" required />
              <Input label="Registered Email" path="registration.registeredEmail" type="email" required />
              <Input label="Registration Date" path="registration.registrationDate" type="date" required />
              <Input label="Registered Mobile" path="registration.registeredMobile" required />
              <Input label="Registered Country" path="registration.registeredCountry" required />
              <Input label="Alternate Mobile" path="registration.alternateMobile" />
              <Input label="Alternate Mobile No" path="registration.alternateMobileNo" />
              <Input label="State" path="registration.state" />
              <Input label="City" path="registration.city" />
              <Input label="Course" path="registration.course" required />
              <Input label="Admission Intake" path="registration.admissionIntake" required />
              <Input label="Occupation" path="registration.occupation" />
              <Input label="Relationship" path="registration.relationship" />
              <Input label="Annual Income" path="registration.annualIncome" />
              <Input label="Father Name" path="registration.fatherName" />
              <Input label="Application No" path="registration.applicationNo" />
              <Input label="Program" path="registration.program" />
              <Input label="Specialization" path="registration.specialization" />
              <Input label="School Name" path="registration.schoolName" />
              <Input label="Category / Nationality" path="registration.categoryNationality" />
              <Input label="Admission Owner" path="registration.admissionOwner" />
              <Input label="Admission Category" path="registration.admissionCategory" />
              <Input label="Withdrawal Documents Eligibility Checked?" path="registration.withdrawalDocsEligible" />
              <Input label="Title" path="registration.title" />
              <Input label="Referral Code" path="registration.referralCode" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <StepHeader title="Applicant Details" subtitle="Personal and identity details of the applicant." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input label="Title" path="applicant.title" />
              <Input label="First Name" path="applicant.firstName" required />
              <Input label="Middle Name" path="applicant.middleName" />
              <Input label="Last Name" path="applicant.lastName" required />
              <Input label="Email Address" path="applicant.email" type="email" required />
              <Input label="Mobile Number" path="applicant.mobile" required />
              <Input label="Date Of Birth" path="applicant.dateOfBirth" type="date" required />
              <Select label="Gender" path="applicant.gender" options={["Male", "Female", "Other"]} required />
              <Input label="Place Of Birth" path="applicant.placeOfBirth" />
              <Input label="Religion" path="applicant.religion" />
              <Input label="Blood Group" path="applicant.bloodGroup" />
              <Input label="Marital Status" path="applicant.maritalStatus" />
              <Select label="Do You Require Transport" path="applicant.requireTransport" options={["Yes", "No"]} />
              <Select label="Do You Require Hostel Facility" path="applicant.requireHostel" options={["Yes", "No"]} />
              <Input label="Room Type" path="applicant.roomType" />
              <Select label="Person With Disabilities (PWD)" path="applicant.pwd" options={["Yes", "No"]} />
              <Input label="Caste Category" path="applicant.casteCategory" />
              <Input label="Aadhar Card Number" path="applicant.aadharNumber" />
              <Input label="Please Select As Applicable" path="applicant.applicable" />
              <Input label="Country Of Birth" path="applicant.countryOfBirth" />
              <Input label="VISA Type" path="applicant.visaType" />
              <Input label="VISA Number" path="applicant.visaNumber" />
              <Input label="Duration" path="applicant.visaDuration" />
              <Input label="Fee" path="applicant.fee" />
              <Input label="Country Of Residence" path="applicant.countryOfResidence" />
              <Input label="Passport Number" path="applicant.passportNumber" />
              <Input label="Country" path="applicant.passportCountry" />
              <Input label="Place Of Issue" path="applicant.passportPlaceOfIssue" />
              <Input label="Date Of Issue" path="applicant.passportDateOfIssue" type="date" />
              <Input label="Date Of Expiry" path="applicant.passportDateOfExpiry" type="date" />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <StepHeader title="Parents / Guardians & Address" subtitle="Parent details and address information." />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Parents / Guardians Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Father's Name" path="parents.father.name" required />
                <Input label="Father's Email" path="parents.father.email" />
                <Input label="Father's Mobile" path="parents.father.mobile" required />
                <Input label="Father's PAN Card No" path="parents.father.pan" />
                <Input label="Father's Occupation" path="parents.father.occupation" />
                <Input label="Father's Designation" path="parents.father.designation" />
                <Input label="Mother's Name" path="parents.mother.name" />
                <Input label="Mother's Email" path="parents.mother.email" />
                <Input label="Mother's Mobile" path="parents.mother.mobile" />
                <Input label="Mother's PAN Card No" path="parents.mother.pan" />
                <Input label="Mother's Occupation" path="parents.mother.occupation" />
                <Input label="Mother's Designation" path="parents.mother.designation" />
                <Input label="Guardian's Name" path="parents.guardian.name" />
                <Input label="Guardian's Email" path="parents.guardian.email" />
                <Input label="Guardian's Mobile" path="parents.guardian.mobile" />
                <Input label="Guardian's PAN Card No" path="parents.guardian.pan" />
                <Input label="Guardian's Occupation" path="parents.guardian.occupation" />
                <Input label="Guardian's Designation" path="parents.guardian.designation" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Address For Communication</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Country" path="addresses.communication.country" required />
                <Input label="State" path="addresses.communication.state" required />
                <Input label="District" path="addresses.communication.district" />
                <Input label="City" path="addresses.communication.city" required />
                <Input label="Address Line 1" path="addresses.communication.addressLine1" required />
                <Input label="Address Line 2" path="addresses.communication.addressLine2" />
                <Input label="Pincode" path="addresses.communication.pincode" required />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.addresses.permanentSameAsCommunication}
                onChange={(e) => updateField("addresses.permanentSameAsCommunication", e.target.checked)}
              />
              Is Permanent Address Same As Address For Communication?
            </label>

            {!formData.addresses.permanentSameAsCommunication && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Permanent Address</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Input label="Country" path="addresses.permanent.country" required />
                  <Input label="State" path="addresses.permanent.state" required />
                  <Input label="District" path="addresses.permanent.district" />
                  <Input label="City" path="addresses.permanent.city" required />
                  <Input label="Address Line 1" path="addresses.permanent.addressLine1" required />
                  <Input label="Address Line 2" path="addresses.permanent.addressLine2" />
                  <Input label="Pincode" path="addresses.permanent.pincode" required />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <StepHeader title="Education Details" subtitle="Academic qualifications and entrance exams." />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">10th Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Institute Name" path="education.tenth.instituteName" required />
                <Input label="Board" path="education.tenth.board" required />
                <Input label="Register Number / Roll No" path="education.tenth.rollNo" />
                <Input label="Year Of Passing" path="education.tenth.yearOfPassing" required />
                <Input label="Obtained Percentage / CGPA" path="education.tenth.percentage" required />
                <Input label="Marking Scheme" path="education.tenth.markingScheme" />
                <Select label="Have You Studied Kannada As A Language" path="education.tenth.studiedKannada" options={["Yes", "No"]} />
                <Select label="Studied Up To 10th Std" path="education.tenth.studiedUpTo10th" options={["Yes", "No"]} />
                <Select label="Studied Up To 12th Std" path="education.tenth.studiedUpTo12th" options={["Yes", "No"]} />
                <Input label="After 10th Qualification" path="education.tenth.after10thQualification" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">12th Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Institute Name With Branch" path="education.twelfth.instituteNameWithBranch" />
                <Input label="Board" path="education.twelfth.board" />
                <Input label="Register Number / Roll No" path="education.twelfth.rollNo" />
                <Input label="Stream" path="education.twelfth.stream" />
                <Input label="Year Of Passing" path="education.twelfth.yearOfPassing" />
                <Input label="Result Status" path="education.twelfth.resultStatus" />
                <Input label="Obtained Percentage" path="education.twelfth.percentage" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.education.twelfth.subjects.map((_, idx) => (
                  <div key={`twelfth-subject-${idx}`} className="rounded-xl border border-gray-100 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Subject {idx + 1}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input label="Subject" path={`education.twelfth.subjects.${idx}.subject`} />
                      <Input label="Maximum Marks" path={`education.twelfth.subjects.${idx}.maxMarks`} />
                      <Input label="Obtained Marks" path={`education.twelfth.subjects.${idx}.obtainedMarks`} />
                      <Input label="Obtained Percentage" path={`education.twelfth.subjects.${idx}.percentage`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Total Subjects" path="education.twelfth.totals.totalSubjects" />
                <Input label="Total Maximum Marks" path="education.twelfth.totals.totalMaxMarks" />
                <Input label="Total Obtained Marks" path="education.twelfth.totals.totalObtainedMarks" />
                <Input label="Total Obtained Percentage" path="education.twelfth.totals.totalPercentage" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Diploma Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Institute Name With Branch" path="education.diploma.instituteNameWithBranch" />
                <Input label="Board / University" path="education.diploma.boardOrUniversity" />
                <Input label="Register Number / Roll No" path="education.diploma.rollNo" />
                <Input label="Stream" path="education.diploma.stream" />
                <Input label="Year Of Passing" path="education.diploma.yearOfPassing" />
                <Input label="Result Status" path="education.diploma.resultStatus" />
                <Input label="Obtained Percentage" path="education.diploma.percentage" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Graduation (UG) Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Result Status" path="education.ug.resultStatus" />
                <Input label="UG Institute" path="education.ug.institute" />
                <Input label="UG University" path="education.ug.university" />
                <Input label="UG Register Number" path="education.ug.registerNumber" />
                <Input label="UG Year Of Passing" path="education.ug.yearOfPassing" />
                <Input label="UG Total Marks" path="education.ug.totalMarks" />
                <Input label="UG Marks Obtained" path="education.ug.marksObtained" />
                <Input label="UG Overall Percentage" path="education.ug.overallPercentage" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.education.ug.subjects.map((_, idx) => (
                  <div key={`ug-subject-${idx}`} className="rounded-xl border border-gray-100 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Subject {idx + 1}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input label="Subject" path={`education.ug.subjects.${idx}.subject`} />
                      <Input label="Maximum Marks" path={`education.ug.subjects.${idx}.maxMarks`} />
                      <Input label="Obtained Marks" path={`education.ug.subjects.${idx}.obtainedMarks`} />
                      <Input label="Percentage / Grade" path={`education.ug.subjects.${idx}.percentageOrGrade`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Total Subjects" path="education.ug.totals.totalSubjects" />
                <Input label="Total Maximum Marks" path="education.ug.totals.totalMaxMarks" />
                <Input label="Total Obtained Marks" path="education.ug.totals.totalObtainedMarks" />
                <Input label="Total Percentage / Grade" path="education.ug.totals.totalPercentage" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Other Qualifications</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Institute Name" path="education.others.instituteName" />
                <Input label="University" path="education.others.university" />
                <Input label="Degree" path="education.others.degree" />
                <Input label="Year Of Passing" path="education.others.yearOfPassing" />
                <Input label="Result Status" path="education.others.resultStatus" />
                <Input label="Percentage" path="education.others.percentage" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Entrance Exams</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Select label="Have You Appeared For Any Entrance Exam" path="education.entranceExams.appeared" options={["Yes", "No"]} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.education.entranceExams.exams.map((_, idx) => (
                  <div key={`exam-${idx}`} className="rounded-xl border border-gray-100 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Exam {idx + 1}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input label="Exam" path={`education.entranceExams.exams.${idx}.name`} />
                      <Input label="Exam Roll No" path={`education.entranceExams.exams.${idx}.rollNo`} />
                      <Input label="Year Of Appearing" path={`education.entranceExams.exams.${idx}.year`} />
                      <Input label="Result Status" path={`education.entranceExams.exams.${idx}.resultStatus`} />
                      <Input label="Score" path={`education.entranceExams.exams.${idx}.score`} />
                      <Input label="All India Rank" path={`education.entranceExams.exams.${idx}.rank`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">International Qualifications (if applicable)</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="O Level/10th - Institute" path="education.international.oLevel.instituteName" />
                <Input label="O Level/10th - Board" path="education.international.oLevel.board" />
                <Input label="O Level/10th - Certificate" path="education.international.oLevel.certificateName" />
                <Input label="O Level/10th - Year Of Passing" path="education.international.oLevel.yearOfPassing" />
                <Input label="O Level/10th - Marks / Score" path="education.international.oLevel.marksScore" />
                <Input label="O Level/10th - GPA/Grade/Percentage" path="education.international.oLevel.gpaGradePercentage" />
                <Input label="A Level/12th - Institute" path="education.international.aLevel.instituteName" />
                <Input label="A Level/12th - Board" path="education.international.aLevel.board" />
                <Input label="A Level/12th - Certificate" path="education.international.aLevel.certificateName" />
                <Input label="A Level/12th - Year Of Passing" path="education.international.aLevel.yearOfPassing" />
                <Input label="A Level/12th - Marks / Score" path="education.international.aLevel.marksScore" />
                <Input label="A Level/12th - GPA/Grade/Percentage" path="education.international.aLevel.gpaGradePercentage" />
                <Input label="Diploma/Certificate - Institute" path="education.international.diplomaCertificate.instituteName" />
                <Input label="Diploma/Certificate - Board" path="education.international.diplomaCertificate.board" />
                <Input label="Diploma/Certificate - Certificate" path="education.international.diplomaCertificate.certificateName" />
                <Input label="Diploma/Certificate - Year Of Passing" path="education.international.diplomaCertificate.yearOfPassing" />
                <Input label="Diploma/Certificate - Marks / Score" path="education.international.diplomaCertificate.marksScore" />
                <Input label="Diploma/Certificate - GPA/Grade/Percentage" path="education.international.diplomaCertificate.gpaGradePercentage" />
                <Input label="Bachelor's Degree - Institute" path="education.international.bachelors.instituteName" />
                <Input label="Bachelor's Degree - Board" path="education.international.bachelors.board" />
                <Input label="Bachelor's Degree - Certificate" path="education.international.bachelors.certificateName" />
                <Input label="Bachelor's Degree - Year Of Passing" path="education.international.bachelors.yearOfPassing" />
                <Input label="Bachelor's Degree - Marks / Score" path="education.international.bachelors.marksScore" />
                <Input label="Bachelor's Degree - GPA/Grade/Percentage" path="education.international.bachelors.gpaGradePercentage" />
                <Input label="Master's Degree - Institute" path="education.international.masters.instituteName" />
                <Input label="Master's Degree - Board" path="education.international.masters.board" />
                <Input label="Master's Degree - Certificate" path="education.international.masters.certificateName" />
                <Input label="Master's Degree - Year Of Passing" path="education.international.masters.yearOfPassing" />
                <Input label="Master's Degree - Marks / Score" path="education.international.masters.marksScore" />
                <Input label="Master's Degree - GPA/Grade/Percentage" path="education.international.masters.gpaGradePercentage" />
                <Input label="Any Other Qualification - Institute" path="education.international.otherQualification.instituteName" />
                <Input label="Any Other Qualification - Board" path="education.international.otherQualification.board" />
                <Input label="Any Other Qualification - Certificate" path="education.international.otherQualification.certificateName" />
                <Input label="Any Other Qualification - Year Of Passing" path="education.international.otherQualification.yearOfPassing" />
                <Input label="Any Other Qualification - Marks / Score" path="education.international.otherQualification.marksScore" />
                <Input label="Any Other Qualification - GPA/Grade/Percentage" path="education.international.otherQualification.gpaGradePercentage" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <StepHeader title="Uploads & Declaration" subtitle="Upload required documents and confirm declaration." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FileInput label="Upload Recent Passport Size Photograph" fileKey="photo" accept="image/*" />
              <FileInput label="Upload Your Signature" fileKey="signature" accept="image/*" />
              <FileInput label="Upload Diploma / Certificate" fileKey="diplomaCertificate" accept="image/*,.pdf,.doc,.docx" />
              <FileInput label="Upload Bachelor's Degree Certificate & Transcript" fileKey="bachelorCertificate" accept="image/*,.pdf,.doc,.docx" />
              <FileInput label="Upload Master's Degree Certificate & Transcript" fileKey="masterCertificate" accept="image/*,.pdf,.doc,.docx" />
              <FileInput label="Upload Other Qualification Certificate" fileKey="otherQualificationCertificate" accept="image/*,.pdf,.doc,.docx" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input label="Applicant Name" path="declaration.applicantName" required />
              <Input label="Parent Name" path="declaration.parentName" required />
              <Input label="Date" path="declaration.date" type="date" required />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 1}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
          >
            Previous
          </button>
          <div className="flex gap-3">
            {currentStep < 5 && (
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-[#441A6B] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#3a1559]"
              >
                Next
              </button>
            )}
            {currentStep === 5 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-[#D35B42] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#b84b35] disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
