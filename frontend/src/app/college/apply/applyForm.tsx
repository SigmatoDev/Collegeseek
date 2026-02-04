"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { toast } from "react-hot-toast";
import Input from "@/components/application/inputs/input";

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

const emptySubject = () => ({
  subject: "",
  maxMarks: "",
  obtainedMarks: "",
  percentage: "",
});
const emptyUGSubject = () => ({
  subject: "",
  maxMarks: "",
  obtainedMarks: "",
  percentageOrGrade: "",
});

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
    father: {
      name: "",
      email: "",
      mobile: "",
      pan: "",
      occupation: "",
      designation: "",
    },
    mother: {
      name: "",
      email: "",
      mobile: "",
      pan: "",
      occupation: "",
      designation: "",
    },
    guardian: {
      name: "",
      email: "",
      mobile: "",
      pan: "",
      occupation: "",
      designation: "",
    },
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
      subjects: [
        emptySubject(),
        emptySubject(),
        emptySubject(),
        emptySubject(),
        emptySubject(),
      ],
      totals: {
        totalSubjects: "",
        totalMaxMarks: "",
        totalObtainedMarks: "",
        totalPercentage: "",
      },
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
      totals: {
        totalSubjects: "",
        totalMaxMarks: "",
        totalObtainedMarks: "",
        totalPercentage: "",
      },
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
      oLevel: {
        instituteName: "",
        board: "",
        certificateName: "",
        yearOfPassing: "",
        marksScore: "",
        gpaGradePercentage: "",
      },
      aLevel: {
        instituteName: "",
        board: "",
        certificateName: "",
        yearOfPassing: "",
        marksScore: "",
        gpaGradePercentage: "",
      },
      diplomaCertificate: {
        instituteName: "",
        board: "",
        certificateName: "",
        yearOfPassing: "",
        marksScore: "",
        gpaGradePercentage: "",
      },
      bachelors: {
        instituteName: "",
        board: "",
        certificateName: "",
        yearOfPassing: "",
        marksScore: "",
        gpaGradePercentage: "",
      },
      masters: {
        instituteName: "",
        board: "",
        certificateName: "",
        yearOfPassing: "",
        marksScore: "",
        gpaGradePercentage: "",
      },
      otherQualification: {
        instituteName: "",
        board: "",
        certificateName: "",
        yearOfPassing: "",
        marksScore: "",
        gpaGradePercentage: "",
      },
    },
    entranceExams: {
      appeared: "",
      exams: [
        {
          name: "",
          rollNo: "",
          year: "",
          resultStatus: "",
          score: "",
          rank: "",
        },
        {
          name: "",
          rollNo: "",
          year: "",
          resultStatus: "",
          score: "",
          rank: "",
        },
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
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const savedStep =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_STEP_KEY)
        : null;
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
      const nextFiles: FileMap = { ...files };

      for (const key of Object.keys(files)) {
        const blob = await idbGet(key);
        if (blob) {
          nextFiles[key] =
            blob instanceof File
              ? blob
              : new File([blob], key, { type: blob.type });
        }
      }

      setFiles(nextFiles);
    };

    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (path: string, value: any) => {
    setFormData((prev: any) => {
      const keys = path.split(".");
      const updated = { ...prev };

      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...(current[key] ?? {}) };
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;

      return updated;
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
        const value = path
          .split(".")
          .reduce((acc: any, key: string) => acc?.[key], formData);
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
        const value = path
          .split(".")
          .reduce((acc: any, key: string) => acc?.[key], formData);
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
        const value = path
          .split(".")
          .reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (!formData.addresses.permanentSameAsCommunication) {
        const permRequired = [
          [
            "addresses.permanent.addressLine1",
            "Permanent address line 1 is required",
          ],
          ["addresses.permanent.city", "Permanent city is required"],
          ["addresses.permanent.state", "Permanent state is required"],
          ["addresses.permanent.pincode", "Permanent pincode is required"],
          ["addresses.permanent.country", "Permanent country is required"],
        ];
        permRequired.forEach(([path, message]) => {
          const value = path
            .split(".")
            .reduce((acc: any, key: string) => acc?.[key], formData);
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
        const value = path
          .split(".")
          .reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (formData.education.tenth.studiedUpTo12th === "Yes") {
        const req12 = [
          [
            "education.twelfth.instituteNameWithBranch",
            "12th institute name is required",
          ],
          ["education.twelfth.board", "12th board is required"],
          [
            "education.twelfth.yearOfPassing",
            "12th year of passing is required",
          ],
          ["education.twelfth.percentage", "12th percentage is required"],
        ];
        req12.forEach(([path, message]) => {
          const value = path
            .split(".")
            .reduce((acc: any, key: string) => acc?.[key], formData);
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
        const value = path
          .split(".")
          .reduce((acc: any, key: string) => acc?.[key], formData);
        if (!value) nextErrors[path] = message;
      });
      if (!files.photo) nextErrors["uploads.photo"] = "Photo is required";
      if (!files.signature)
        nextErrors["uploads.signature"] = "Signature is required";
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
      toast.error(
        error?.response?.data?.message || "Failed to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const StepHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

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
    const value =
      path.split(".").reduce((acc: any, key: string) => acc?.[key], formData) ??
      "";
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

  const FileInput = ({
    label,
    fileKey,
    accept,
  }: {
    label: string;
    fileKey: string;
    accept: string;
  }) => {
    const error = stepErrors[`uploads.${fileKey}`];
    return (
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <input
          type="file"
          accept={accept}
          onChange={(e) =>
            handleFileChange(fileKey, e.target.files?.[0] || null)
          }
          className={`rounded-lg border px-3 py-2 text-sm ${error ? "border-red-400" : "border-gray-200"}`}
        />
        {files[fileKey] && (
          <span className="text-xs text-gray-500">
            Selected: {files[fileKey]?.name}
          </span>
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
                  active
                    ? "border-[#7a6be7] bg-[#f6f5ff] text-[#44368a]"
                    : "border-gray-200 text-gray-500"
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
            <StepHeader
              title="Registration & Admission"
              subtitle="Provide registration and admission details."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Form Name"
                path="registration.formName"
                required
                placeholder="Enter form name"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Registered Name"
                path="registration.registeredName"
                required
                placeholder="Enter Registered Name"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Registered Email"
                path="registration.registeredEmail"
                type="email"
                required
                placeholder="Enter Registered Email"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Registration Date"
                path="registration.registrationDate"
                type="date"
                placeholder="Enter Registered Date"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Registered Mobile"
                path="registration.registeredMobile"
                type="tel"
                placeholder="Enter Registered Mobile"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Registered Country"
                path="registration.registeredCountry"
                placeholder="Enter Registered Country"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Alternate Mobile"
                path="registration.alternateMobile"
                type="tel"
                placeholder="Enter Alternate Mobile"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Alternate Mobile No"
                path="registration.alternateMobileNo"
                type="tel"
                placeholder="Enter Alternate Mobile No"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="State"
                path="registration.state"
                placeholder="Enter State"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="City"
                path="registration.city"
                placeholder="Enter City"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Course"
                path="registration.course"
                placeholder="Enter Course"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Admission Intake"
                path="registration.admissionIntake"
                required
                placeholder="Enter Admission Intake"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Occupation"
                path="registration.occupation"
                placeholder="Enter Occupation"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Relationship"
                path="registration.relationship"
                placeholder="Enter Relationship"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Annual Income"
                path="registration.annualIncome"
                placeholder="Enter Annual Income"
                type="tel"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Father Name"
                path="registration.fatherName"
                placeholder="Enter Father Name"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Application No"
                path="registration.applicationNo"
                type="tel"
                placeholder="Enter Application No"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Program"
                path="registration.program"
                placeholder="Enter Registered Program"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Specialization"
                path="registration.specialization"
                placeholder="Enter Specialization"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="School Name"
                path="registration.schoolName"
                placeholder="Enter School Name"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Category / Nationality"
                path="registration.categoryNationality"
                placeholder="Enter Category / Nationality"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Admission Owner"
                path="registration.admissionOwner"
                placeholder="Admission Owner"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Admission Category"
                path="registration.admissionCategory"
                placeholder="Merit / Management"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Withdrawal Documents Eligibility Checked?"
                path="registration.withdrawalDocsEligible"
                placeholder="Yes / No"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Title"
                path="registration.title"
                placeholder="Mr"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Referral Code"
                path="registration.referralCode"
                placeholder="Enter referral code"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <StepHeader
              title="Applicant Details"
              subtitle="Personal and identity details of the applicant."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Title"
                path="applicant.title"
                placeholder="Mr., Ms.,"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="First Name"
                path="applicant.firstName"
                placeholder="Enter first name"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Middle Name"
                path="applicant.middleName"
                placeholder="Enter middle name"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Last Name"
                path="applicant.lastName"
                placeholder="Enter last name"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Email Address"
                path="applicant.email"
                type="email"
                placeholder="Enter your email"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Mobile Number"
                path="applicant.mobile"
                type="tel"
                placeholder="Enter mobile number"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Date Of Birth"
                path="applicant.dateOfBirth"
                type="date"
                placeholder="Select date of birth"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Select
                label="Gender"
                path="applicant.gender"
                options={["Male", "Female", "Other"]}
                required
              />
              <Input
                label="Place Of Birth"
                path="applicant.placeOfBirth"
                placeholder="Place Of Birth"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Religion"
                path="applicant.religion"
                placeholder="Enter your religion"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Blood Group"
                path="applicant.bloodGroup"
                placeholder="Enter your blood group (A+, O-)"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Marital Status"
                path="applicant.maritalStatus"
                placeholder="Single / Married / Divorced"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Select
                label="Do You Require Transport"
                path="applicant.requireTransport"
                options={["Yes", "No"]}
              />
              <Select
                label="Do You Require Hostel Facility"
                path="applicant.requireHostel"
                options={["Yes", "No"]}
              />
              <Input
                label="Room Type"
                path="applicant.roomType"
                placeholder="Room Type"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Select
                label="Person With Disabilities (PWD)"
                path="applicant.pwd"
                options={["Yes", "No"]}
              />
              <Input
                label="Caste Category"
                path="applicant.casteCategory"
                placeholder="Enter caste category (if any)"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Aadhar Card Number"
                path="applicant.aadharNumber"
                placeholder="Enter 12-digit Aadhar number"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Please Enter As Applicable"
                path="applicant.applicable"
                placeholder="Enter applicable"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Country Of Birth"
                path="applicant.countryOfBirth"
                placeholder="India"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="VISA Type"
                path="applicant.visaType"
                placeholder="Student / Work / Tourist"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="VISA Number"
                path="applicant.visaNumber"
                placeholder="Enter your VISA number"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Duration"
                path="applicant.visaDuration"
                placeholder="Enter VISA duration"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Fee"
                path="applicant.fee"
                type="number"
                placeholder="Enter fee amount"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Country Of Residence"
                path="applicant.countryOfResidence"
                placeholder="Enter country of residence"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Passport Number"
                path="applicant.passportNumber"
                placeholder="Enter passport number"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Country"
                path="applicant.passportCountry"
                placeholder="Enter country of passport issue"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
              <Input
                label="Place Of Issue"
                path="applicant.passportPlaceOfIssue"
                placeholder="Enter place of passport issue"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Date Of Issue"
                path="applicant.passportDateOfIssue"
                type="date"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Date Of Expiry"
                path="applicant.passportDateOfExpiry"
                type="date"
                placeholder="Select date of expiry"
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <StepHeader
              title="Parents / Guardians & Address"
              subtitle="Parent details and address information."
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Parents / Guardians Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Father's Name"
                  path="parents.father.name"
                  required
                  placeholder="Enter father's full name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Father's Email"
                  path="parents.father.email"
                  type="email"
                  placeholder="Enter father's email address"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Father's Mobile"
                  path="parents.father.mobile"
                  type="tel"
                  required
                  placeholder="Enter father's mobile number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Father's PAN Card No"
                  path="parents.father.pan"
                  placeholder="Enter father's PAN card number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Father's Occupation"
                  path="parents.father.occupation"
                  placeholder="Enter father's occupation"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Father's Designation"
                  path="parents.father.designation"
                  placeholder="Enter father's designation"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Mother's Name"
                  path="parents.mother.name"
                  placeholder="Enter mother's full name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Mother's Email"
                  path="parents.mother.email"
                  type="email"
                  placeholder="Enter mother's email address"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Mother's Mobile"
                  path="parents.mother.mobile"
                  type="tel"
                  placeholder="Enter mother's mobile number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Mother's PAN Card No"
                  path="parents.mother.pan"
                  placeholder="Enter mother's PAN card number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Mother's Occupation"
                  path="parents.mother.occupation"
                  placeholder="Enter mother's occupation"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Mother's Designation"
                  path="parents.mother.designation"
                  placeholder="Enter mother's designation"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Guardian's Name"
                  path="parents.guardian.name"
                  placeholder="Enter guardian's full name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Guardian's Email"
                  path="parents.guardian.email"
                  type="email"
                  placeholder="Enter guardian's email address"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
                <Input
                  label="Guardian's Mobile"
                  path="parents.guardian.mobile"
                  type="tel"
                  placeholder="Enter guardian's mobile number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Guardian's PAN Card No"
                  path="parents.guardian.pan"
                  placeholder="Enter guardian's PAN card number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Guardian's Occupation"
                  path="parents.guardian.occupation"
                  placeholder="Enter guardian's occupation"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Guardian's Designation"
                  path="parents.guardian.designation"
                  placeholder="Enter guardian's designation"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Address For Communication
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Country"
                  path="addresses.communication.country"
                  placeholder="Enter country"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="State"
                  path="addresses.communication.state"
                  placeholder="Enter state"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="District"
                  path="addresses.communication.district"
                  placeholder="Enter district"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="City"
                  path="addresses.communication.city"
                  placeholder="Enter city"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Address Line 1"
                  path="addresses.communication.addressLine1"
                  placeholder="Enter address line 1"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Address Line 2"
                  path="addresses.communication.addressLine2"
                  placeholder="Enter address line 2"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Pincode"
                  path="addresses.communication.pincode"
                  placeholder="Enter pincode"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.addresses.permanentSameAsCommunication}
                onChange={(e) =>
                  updateField(
                    "addresses.permanentSameAsCommunication",
                    e.target.checked,
                  )
                }
              />
              Is Permanent Address Same As Address For Communication?
            </label>

            {!formData.addresses.permanentSameAsCommunication && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Permanent Address
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="Country"
                    path="addresses.permanent.country"
                    placeholder="Enter country"
                    required
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />

                  <Input
                    label="State"
                    path="addresses.permanent.state"
                    placeholder="Enter state"
                    required
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />

                  <Input
                    label="District"
                    path="addresses.permanent.district"
                    placeholder="Enter district"
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />

                  <Input
                    label="City"
                    path="addresses.permanent.city"
                    placeholder="Enter city"
                    required
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />

                  <Input
                    label="Address Line 1"
                    path="addresses.permanent.addressLine1"
                    placeholder="Enter address line 1"
                    required
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />

                  <Input
                    label="Address Line 2"
                    path="addresses.permanent.addressLine2"
                    placeholder="Enter address line 2"
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />

                  <Input
                    label="Pincode"
                    path="addresses.permanent.pincode"
                    placeholder="Enter pincode"
                    required
                    formData={formData}
                    stepErrors={stepErrors}
                    updateField={updateField}
                    clearFieldError={clearFieldError}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <StepHeader
              title="Education Details"
              subtitle="Academic qualifications and entrance exams."
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                10th Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Institute Name"
                  path="education.tenth.instituteName"
                  placeholder="Enter institute name"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Board"
                  path="education.tenth.board"
                  placeholder="Enter board name"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Register Number / Roll No"
                  path="education.tenth.rollNo"
                  placeholder="Enter register/roll number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Year Of Passing"
                  path="education.tenth.yearOfPassing"
                  placeholder="Enter year of passing"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Obtained Percentage / CGPA"
                  path="education.tenth.percentage"
                  placeholder="Enter obtained percentage / CGPA"
                  required
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Marking Scheme"
                  path="education.tenth.markingScheme"
                  placeholder="Enter marking scheme"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Select
                  label="Have You Studied Kannada As A Language"
                  path="education.tenth.studiedKannada"
                  options={["Yes", "No"]}
                />
                <Select
                  label="Studied Up To 10th Std"
                  path="education.tenth.studiedUpTo10th"
                  options={["Yes", "No"]}
                />
                <Select
                  label="Studied Up To 12th Std"
                  path="education.tenth.studiedUpTo12th"
                  options={["Yes", "No"]}
                />
                <Input
                  label="After 10th Qualification"
                  path="education.tenth.after10thQualification"
                  placeholder="Enter qualification after 10th"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                12th Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Institute Name With Branch"
                  path="education.twelfth.instituteNameWithBranch"
                  placeholder="Enter institute name with branch"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Board"
                  path="education.twelfth.board"
                  placeholder="Enter board name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Register Number / Roll No"
                  path="education.twelfth.rollNo"
                  placeholder="Enter register/roll number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Stream"
                  path="education.twelfth.stream"
                  placeholder="Enter stream"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Year Of Passing"
                  path="education.twelfth.yearOfPassing"
                  placeholder="Enter year of passing"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Result Status"
                  path="education.twelfth.resultStatus"
                  placeholder="Enter result status"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Obtained Percentage"
                  path="education.twelfth.percentage"
                  placeholder="Enter obtained percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.education.twelfth.subjects.map((_, idx) => (
                  <div
                    key={`twelfth-subject-${idx}`}
                    className="rounded-xl border border-gray-100 p-3"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Subject {idx + 1}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        label="Subject"
                        path={`education.twelfth.subjects.${idx}.subject`}
                        placeholder="Enter subject name"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />

                      <Input
                        label="Maximum Marks"
                        path={`education.twelfth.subjects.${idx}.maxMarks`}
                        placeholder="Enter maximum marks"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />

                      <Input
                        label="Obtained Marks"
                        path={`education.twelfth.subjects.${idx}.obtainedMarks`}
                        placeholder="Enter obtained marks"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />

                      <Input
                        label="Obtained Percentage"
                        path={`education.twelfth.subjects.${idx}.percentage`}
                        placeholder="Enter obtained percentage"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Total Subjects"
                  path="education.twelfth.totals.totalSubjects"
                  placeholder="Enter total subjects"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Total Maximum Marks"
                  path="education.twelfth.totals.totalMaxMarks"
                  placeholder="Enter total maximum marks"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Total Obtained Marks"
                  path="education.twelfth.totals.totalObtainedMarks"
                  placeholder="Enter total obtained marks"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Total Obtained Percentage"
                  path="education.twelfth.totals.totalPercentage"
                  placeholder="Enter total obtained percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Diploma Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Institute Name With Branch"
                  path="education.diploma.instituteNameWithBranch"
                  placeholder="Enter institute name with branch"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Board / University"
                  path="education.diploma.boardOrUniversity"
                  placeholder="Enter board or university"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Register Number / Roll No"
                  path="education.diploma.rollNo"
                  placeholder="Enter register/roll number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Stream"
                  path="education.diploma.stream"
                  placeholder="Enter stream"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Year Of Passing"
                  path="education.diploma.yearOfPassing"
                  placeholder="Enter year of passing"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Result Status"
                  path="education.diploma.resultStatus"
                  placeholder="Enter result status"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Obtained Percentage"
                  path="education.diploma.percentage"
                  placeholder="Enter obtained percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Graduation (UG) Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Result Status"
                  path="education.ug.resultStatus"
                  placeholder="Enter result status"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG Institute"
                  path="education.ug.institute"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG University"
                  path="education.ug.university"
                  placeholder="Enter university name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG Register Number"
                  path="education.ug.registerNumber"
                  placeholder="Enter register/roll number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG Year Of Passing"
                  path="education.ug.yearOfPassing"
                  placeholder="Enter year of passing"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG Total Marks"
                  path="education.ug.totalMarks"
                  placeholder="Enter total marks"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG Marks Obtained"
                  path="education.ug.marksObtained"
                  placeholder="Enter obtained marks"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="UG Overall Percentage"
                  path="education.ug.overallPercentage"
                  placeholder="Enter overall percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.education.ug.subjects.map((_, idx) => (
                  <div
                    key={`ug-subject-${idx}`}
                    className="rounded-xl border border-gray-100 p-3"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Subject {idx + 1}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        label="Subject"
                        path={`education.ug.subjects.${idx}.subject`}
                        placeholder="Enter subject name"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Maximum Marks"
                        path={`education.ug.subjects.${idx}.maxMarks`}
                        placeholder="Enter max marks"
                        type="number"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Obtained Marks"
                        path={`education.ug.subjects.${idx}.obtainedMarks`}
                        placeholder="Enter obtained marks"
                        type="number"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Percentage / Grade"
                        path={`education.ug.subjects.${idx}.percentageOrGrade`}
                        placeholder="Enter percentage or grade"
                        type="text"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Total Subjects"
                  path="education.ug.totals.totalSubjects"
                  placeholder="Enter total number of subjects"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Total Maximum Marks"
                  path="education.ug.totals.totalMaxMarks"
                  placeholder="Enter total maximum marks"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Total Obtained Marks"
                  path="education.ug.totals.totalObtainedMarks"
                  placeholder="Enter total obtained marks"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Total Percentage / Grade"
                  path="education.ug.totals.totalPercentage"
                  placeholder="Enter total percentage or grade"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Other Qualifications
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Institute Name"
                  path="education.others.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="University"
                  path="education.others.university"
                  placeholder="Enter university name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Degree"
                  path="education.others.degree"
                  placeholder="Enter degree"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Year Of Passing"
                  path="education.others.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Result Status"
                  path="education.others.resultStatus"
                  placeholder="Enter result status"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Percentage"
                  path="education.others.percentage"
                  placeholder="Enter percentage"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Entrance Exams
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Select
                  label="Have You Appeared For Any Entrance Exam"
                  path="education.entranceExams.appeared"
                  options={["Yes", "No"]}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formData.education.entranceExams.exams.map((_, idx) => (
                  <div
                    key={`exam-${idx}`}
                    className="rounded-xl border border-gray-100 p-3"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Exam {idx + 1}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        label="Exam"
                        path={`education.entranceExams.exams.${idx}.name`}
                        placeholder="Enter exam name"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Exam Roll No"
                        path={`education.entranceExams.exams.${idx}.rollNo`}
                        placeholder="Enter roll number"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Year Of Appearing"
                        path={`education.entranceExams.exams.${idx}.year`}
                        placeholder="Enter year"
                        type="number"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Result Status"
                        path={`education.entranceExams.exams.${idx}.resultStatus`}
                        placeholder="Enter result status"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="Score"
                        path={`education.entranceExams.exams.${idx}.score`}
                        placeholder="Enter score"
                        type="number"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                      <Input
                        label="All India Rank"
                        path={`education.entranceExams.exams.${idx}.rank`}
                        placeholder="Enter rank"
                        type="number"
                        formData={formData}
                        stepErrors={stepErrors}
                        updateField={updateField}
                        clearFieldError={clearFieldError}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                International Qualifications (if applicable)
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* O Level / 10th */}
                <Input
                  label="O Level/10th - Institute"
                  path="education.international.oLevel.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="O Level/10th - Board"
                  path="education.international.oLevel.board"
                  placeholder="Enter board"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="O Level/10th - Certificate"
                  path="education.international.oLevel.certificateName"
                  placeholder="Enter certificate name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="O Level/10th - Year Of Passing"
                  path="education.international.oLevel.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="O Level/10th - Marks / Score"
                  path="education.international.oLevel.marksScore"
                  placeholder="Enter marks or score"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="O Level/10th - GPA/Grade/Percentage"
                  path="education.international.oLevel.gpaGradePercentage"
                  placeholder="Enter GPA, grade, or percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* A Level / 12th */}
                <Input
                  label="A Level/12th - Institute"
                  path="education.international.aLevel.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="A Level/12th - Board"
                  path="education.international.aLevel.board"
                  placeholder="Enter board"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="A Level/12th - Certificate"
                  path="education.international.aLevel.certificateName"
                  placeholder="Enter certificate name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* A Level / 12th */}
                <Input
                  label="A Level/12th - Year Of Passing"
                  path="education.international.aLevel.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="A Level/12th - Marks / Score"
                  path="education.international.aLevel.marksScore"
                  placeholder="Enter marks or score"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="A Level/12th - GPA/Grade/Percentage"
                  path="education.international.aLevel.gpaGradePercentage"
                  placeholder="Enter GPA, grade, or percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* Diploma / Certificate */}
                <Input
                  label="Diploma/Certificate - Institute"
                  path="education.international.diplomaCertificate.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Diploma/Certificate - Board"
                  path="education.international.diplomaCertificate.board"
                  placeholder="Enter board"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Diploma/Certificate - Certificate"
                  path="education.international.diplomaCertificate.certificateName"
                  placeholder="Enter certificate name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Diploma/Certificate - Year Of Passing"
                  path="education.international.diplomaCertificate.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Diploma/Certificate - Marks / Score"
                  path="education.international.diplomaCertificate.marksScore"
                  placeholder="Enter marks or score"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Diploma/Certificate - GPA/Grade/Percentage"
                  path="education.international.diplomaCertificate.gpaGradePercentage"
                  placeholder="Enter GPA, grade, or percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* Bachelor's Degree */}
                <Input
                  label="Bachelor's Degree - Institute"
                  path="education.international.bachelors.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Bachelor's Degree - Board"
                  path="education.international.bachelors.board"
                  placeholder="Enter board/university"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Bachelor's Degree - Certificate"
                  path="education.international.bachelors.certificateName"
                  placeholder="Enter certificate name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Bachelor's Degree - Year Of Passing"
                  path="education.international.bachelors.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Bachelor's Degree - Marks / Score"
                  path="education.international.bachelors.marksScore"
                  placeholder="Enter marks or score"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Bachelor's Degree - GPA/Grade/Percentage"
                  path="education.international.bachelors.gpaGradePercentage"
                  placeholder="Enter GPA, grade, or percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* Master's Degree */}
                <Input
                  label="Master's Degree - Institute"
                  path="education.international.masters.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Master's Degree - Board"
                  path="education.international.masters.board"
                  placeholder="Enter board/university"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Master's Degree - Certificate"
                  path="education.international.masters.certificateName"
                  placeholder="Enter certificate name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Master's Degree - Year Of Passing"
                  path="education.international.masters.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* Master's Degree */}
                <Input
                  label="Master's Degree - Marks / Score"
                  path="education.international.masters.marksScore"
                  placeholder="Enter marks or score"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Master's Degree - GPA/Grade/Percentage"
                  path="education.international.masters.gpaGradePercentage"
                  placeholder="Enter GPA, grade, or percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                {/* Any Other Qualification */}
                <Input
                  label="Any Other Qualification - Institute"
                  path="education.international.otherQualification.instituteName"
                  placeholder="Enter institute name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Any Other Qualification - Board"
                  path="education.international.otherQualification.board"
                  placeholder="Enter board/university"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Any Other Qualification - Certificate"
                  path="education.international.otherQualification.certificateName"
                  placeholder="Enter certificate name"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Any Other Qualification - Year Of Passing"
                  path="education.international.otherQualification.yearOfPassing"
                  placeholder="Enter year of passing"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Any Other Qualification - Marks / Score"
                  path="education.international.otherQualification.marksScore"
                  placeholder="Enter marks or score"
                  type="number"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />

                <Input
                  label="Any Other Qualification - GPA/Grade/Percentage"
                  path="education.international.otherQualification.gpaGradePercentage"
                  placeholder="Enter GPA, grade, or percentage"
                  formData={formData}
                  stepErrors={stepErrors}
                  updateField={updateField}
                  clearFieldError={clearFieldError}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <StepHeader
              title="Uploads & Declaration"
              subtitle="Upload required documents and confirm declaration."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FileInput
                label="Upload Recent Passport Size Photograph"
                fileKey="photo"
                accept="image/*"
              />
              <FileInput
                label="Upload Your Signature"
                fileKey="signature"
                accept="image/*"
              />
              <FileInput
                label="Upload Diploma / Certificate"
                fileKey="diplomaCertificate"
                accept="image/*,.pdf,.doc,.docx"
              />
              <FileInput
                label="Upload Bachelor's Degree Certificate & Transcript"
                fileKey="bachelorCertificate"
                accept="image/*,.pdf,.doc,.docx"
              />
              <FileInput
                label="Upload Master's Degree Certificate & Transcript"
                fileKey="masterCertificate"
                accept="image/*,.pdf,.doc,.docx"
              />
              <FileInput
                label="Upload Other Qualification Certificate"
                fileKey="otherQualificationCertificate"
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Applicant Name"
                path="declaration.applicantName"
                placeholder="Enter applicant's full name"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Parent Name"
                path="declaration.parentName"
                placeholder="Enter parent’s full name"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />

              <Input
                label="Date"
                path="declaration.date"
                type="date"
                required
                formData={formData}
                stepErrors={stepErrors}
                updateField={updateField}
                clearFieldError={clearFieldError}
              />
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
