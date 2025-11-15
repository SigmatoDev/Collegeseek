"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { College, Course } from "@/components/model/models";
import { Loader } from "lucide-react";
import ProgramModeDropdown from "@/components/programMode/page";
import SpecializationDropdown from "@/components/specializationDropdown/page";
import toast from "react-hot-toast";
import StreamsDropdown from "@/components/streamDropDown/page";

interface Category {
  _id: string;
  name: string;
}

const COURSE_AUTOFILL_TEMPLATES: Record<
  string,
  {
    name?: string;
    description?: string;
    duration?: string;
    eligibility?: string;
    entrance_exam?: string;
    fees?: { amount?: number; currency?: string; year?: number };
    placements?: {
      median_salary?: number;
      currency?: string;
      placement_rate?: number;
    };
}> = {
  "b.tech": {
    name: "B.Tech",
    description:
      "Four year undergraduate engineering program blending core science, hands-on labs, and industry internships.",
    duration: "4 Years",
    eligibility: "10+2 with PCM, minimum 60%, valid JEE/State entrance score.",
    entrance_exam: "JEE Main / State CET",
    fees: { amount: 250000, currency: "INR" },
    placements: { median_salary: 650000, currency: "INR", placement_rate: 92 },
  },
  mba: {
    name: "MBA",
    description:
      "Two year residential MBA focusing on leadership, analytics, and real-world immersions with CXO mentorship.",
    duration: "2 Years",
    eligibility: "Bachelor’s degree with 50% aggregate, CAT/XAT/GMAT score.",
    entrance_exam: "CAT / XAT / GMAT",
    fees: { amount: 450000, currency: "INR" },
    placements: { median_salary: 900000, currency: "INR", placement_rate: 96 },
  },
};

const CourseForm = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return <ActualCourseForm />;
};

const ActualCourseForm = () => {
  const router = useRouter();
  const { id: courseId } = useParams();
  const [courseList, setCourseList] = useState<Category[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchCollege, setSearchCollege] = useState("");

  // const [course, setCourse] = useState<Course>({
  //   name: "",
  //   description: "",
  //   college_id: "",
  //   category: "B.Tech",
  //   duration: "",
  //   // mode: "Full-Time",
  //   programMode: "",
  //   specialization: "",
  //   streams: "",
  //   fees: { amount: 0, currency: "INR", year: new Date().getFullYear() },
  //   eligibility: "",
  //   application_dates: { start_date: "", end_date: "" },
  //   ratings: { score: 0, reviews_count: 0 },
  //   placements: { median_salary: 0, currency: "INR", placement_rate: 0 },
  //   intake_capacity: { male: 0, female: 0, total: 0 },
  //   entrance_exam: "",
  //   enrollmentLink: "",
  //   brochure_link: "",
  // });
  const [course, setCourse] = useState<any>({
    name: "",
    description: "",
    college: null, // store full college object here
    category: "B.Tech",
    duration: "",
    programMode: "",
    specialization: "",
    streams: "",
    fees: { amount: 0, currency: "INR", year: new Date().getFullYear() },
    eligibility: "",
    application_dates: { start_date: "", end_date: "" },
    ratings: { score: 0, reviews_count: 0 },
    placements: { median_salary: 0, currency: "INR", placement_rate: 0 },
    intake_capacity: { male: 0, female: 0, total: 0 },
    entrance_exam: "",
    enrollmentLink: "",
    brochure_link: "",
  });

  interface College {
    _id: string;
    name: string;
    city?: string; // now a string
    state?: string; // now a string
    country?: string;
  }

  const filteredColleges = useMemo(() => {
    if (!searchCollege) return colleges;
    const query = searchCollege.toLowerCase();
    return colleges.filter((college) =>
      `${college.name} ${college.state ?? ""} ${college.city ?? ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [colleges, searchCollege]);

  const degreeNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    courseList.forEach((item) => {
      map[item._id] = item.name;
    });
    return map;
  }, [courseList]);

  useEffect(() => {
    axios
      .get(`${api_url}State/colleges/`)
      .then((res) => {
        const data = res.data.data || [];
        // console.log("Fetched Colleges:", data); // <-- log fetched colleges
        setColleges(data);
      })
      .catch((err) => console.error("Error fetching colleges:", err));
  }, []);

  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const response = await axios.get(`${api_url}course-list2`);
        setCourseList(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching course categories:", error);
      }
    };

    fetchCourseList();
  }, []);

  useEffect(() => {
    if (courseId && courseId !== "new" && colleges.length > 0) {
      axios
        .get(`${api_url}courses/${courseId}`)
        .then((res) => {
          const fetchedCourse = res.data || {};

          // If category is an object, store its _id
          if (
            fetchedCourse.category &&
            typeof fetchedCourse.category === "object"
          ) {
            fetchedCourse.category = fetchedCourse.category._id;
          }

          // Replace college_id with the full college object
          if (fetchedCourse.college_id) {
            const fullCollege = colleges.find(
              (c) =>
                c._id === fetchedCourse.college_id._id ||
                c._id === fetchedCourse.college_id
            );
            fetchedCourse.college = fullCollege || null;
          }

          setCourse(fetchedCourse);
        })
        .catch((err) => console.error(err));
    }
  }, [courseId, colleges]); // <--- add 'colleges' here

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      console.log("Field changed:", e.target.name, "Value:", e.target.value); // <--- Add this line
      setCourse((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleNestedChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      section: keyof Course
    ) => {
      setCourse((prev: { [x: string]: Record<string, any> }) => ({
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, any>),
          [e.target.name]: isNaN(Number(e.target.value))
            ? e.target.value
            : Number(e.target.value),
        },
      }));
    },
    []
  );

  const handleCancel = useCallback(
    () => router.push("/admin/manageCourses"),
    [router]
  );

  const validateRequiredSelections = () => {
    if (!course.college) {
      toast.error("Please select a college for this course.");
      return false;
    }
    if (!course.category) {
      toast.error("Please select a degree.");
      return false;
    }
    if (!course.streams) {
      toast.error("Please select a stream.");
      return false;
    }
    if (!course.specialization) {
      toast.error("Please select a specialization.");
      return false;
    }
    if (!course.programMode) {
      toast.error("Please choose a program mode.");
      return false;
    }
    return true;
  };

  const validateCoreFields = () => {
    if (!course.name?.trim()) {
      toast.error("Course title is required.");
      return false;
    }
    if (!course.description?.trim()) {
      toast.error("Add a short description for the course.");
      return false;
    }
    if (!course.duration?.trim()) {
      toast.error("Duration cannot be empty.");
      return false;
    }
    if (!course.eligibility?.trim()) {
      toast.error("Eligibility details are required.");
      return false;
    }
    if (!course.fees?.amount || Number(course.fees.amount) <= 0) {
      toast.error("Please enter a valid fee amount.");
      return false;
    }
    return true;
  };

  const handleAutofillTemplate = () => {
    const degreeName = degreeNameMap[course.category];
    if (!degreeName) {
      toast.error("Select a degree to auto-fill details.");
      return;
    }
    const template =
      COURSE_AUTOFILL_TEMPLATES[degreeName.toLowerCase()] ||
      COURSE_AUTOFILL_TEMPLATES[degreeName.toUpperCase()] ||
      COURSE_AUTOFILL_TEMPLATES[degreeName];
    if (!template) {
      toast.error("No template available for this degree yet.");
      return;
    }
    setCourse((prev: any) => ({
      ...prev,
      ...template,
      fees: { ...prev.fees, ...template.fees, year: prev.fees.year },
      placements: { ...prev.placements, ...template.placements },
    }));
    toast.success("Template values applied. Feel free to tweak them.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequiredSelections() || !validateCoreFields()) {
      return;
    }
    setLoading(true);

    try {
      // Transform course before sending
      const payload = {
        ...course,
        college_id: course.college?._id || course.college, // normalize to id
        category: course.category?._id || course.category,
        programMode: course.programMode?._id || course.programMode,
        specialization: course.specialization?._id || course.specialization,
        streams: Array.isArray(course.streams)
          ? course.streams.map((s: any) => (s?._id ? s._id : s))
          : course.streams,
      };

      // remove nested objects (optional clean up)
      delete (payload as any).college;

      const url = `${api_url}courses${
        courseId && courseId !== "new" ? `/${courseId}` : ""
      }`;

      const method = courseId && courseId !== "new" ? axios.put : axios.post;
      const res = await method(url, payload);

      if (res.status >= 200 && res.status < 300) {
        toast.success(
          `Course ${courseId !== "new" ? "updated" : "added"} successfully!`
        );
        router.push("/admin/manageCourses");
      } else {
        toast.error("Failed to save course.");
      }
    } catch (err) {
      console.error("Error submitting course:", err);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourse((prev: any) => ({ ...prev, programMode: e.target.value }));
  };
  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCourse((prev: any) => ({ ...prev, specialization: e.target.value }));
  };
  const handleStreamsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourse((prev: any) => ({
      ...prev,
      streams: e.target.value,
    }));
  };
  // Capitalize first letter of each word
  const capitalizeWords = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[1580px] mx-auto p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-6"
    >
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        {courseId && courseId !== "new" ? "Edit Course" : "Create New Course"}
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <label
            htmlFor="college_id"
            className="block text-sm font-semibold text-gray-700 pb-2"
          >
            Select College
          </label>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="truncate">
              {course.college
                ? `${course.college.name} (${capitalizeWords(
                    course.college.state ?? ""
                  )}${course.college.city ? `, ${course.college.city}` : ""})`
                : "Select College"}
            </span>
            <span className="text-xs text-gray-500">▼</span>
          </button>

          {isOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-lg border bg-white shadow-lg">
              <div className="sticky top-0 bg-white">
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchCollege}
                  onChange={(e) => setSearchCollege(e.target.value)}
                  className="w-full border-b px-3 py-2 text-sm outline-none"
                  autoFocus
                />
              </div>
              <ul className="max-h-60 overflow-y-auto" role="listbox">
                {filteredColleges.length === 0 && (
                  <li className="px-3 py-2 text-sm text-gray-500">
                    No colleges found.
                  </li>
                )}
                {filteredColleges.map((college) => (
                  <li
                    key={college._id}
                    role="option"
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setCourse((prev: any) => ({ ...prev, college }));
                      setIsOpen(false);
                      setSearchCollege("");
                    }}
                  >
                    <p className="font-medium">{college.name}</p>
                    <p className="text-xs text-gray-500">
                      {[college.city, capitalizeWords(college.state ?? "")]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700"
            >
              Degree
            </label>
            <button
              type="button"
              onClick={handleAutofillTemplate}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Auto-fill
            </button>
          </div>
          <select
            id="category"
            name="category"
            value={course.category ?? ""}
            onChange={handleChange}
            className="mt-2 w-full rounded border p-2"
            required
          >
            <option value="">Select Degree</option>
            {courseList.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <StreamsDropdown
            name="Streams"
            value={course.streams ?? ""}
            onChange={handleStreamsChange}
            label="Streams"
            required
          />
        </div>

        <div>
          <SpecializationDropdown
            name="specialization"
            value={course.specialization ?? ""}
            onChange={handleSpecializationChange}
            label="Specialization"
            required
          />
        </div>

        <div className="md:col-span-2">
          <ProgramModeDropdown
            name="programMode"
            value={course.programMode ?? ""}
            onChange={handleProgramModeChange}
            label="Program Mode"
            required
          />
        </div>
      </div>

      <label
        htmlFor="description"
        className="block text-sm font-semibold text-gray-700"
      >
        Description
      </label>
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={course.description ?? ""}
          onChange={handleChange}
          className="p-2 border rounded col-span-2 w-full mt-[-10px]"
          rows={3}
          required
        />

        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-sm font-semibold text-gray-700"
          >
            Duration
          </label>
          <input
            id="duration"
            name="duration"
            placeholder="Duration"
            value={course.duration ?? ""}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="eligibility"
            className="block text-sm font-semibold text-gray-700"
          >
            Eligibility
          </label>
          <input
            id="eligibility"
            name="eligibility"
            placeholder="Eligibility"
            value={course.eligibility ?? ""}
            onChange={handleChange}
            className="p-2 border rounded w-full mt-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="brochure_link"
            className="font-semibold text-sm text-gray-700"
          >
            Brochure Link
          </label>
          <input
            id="brochure_link"
            name="brochure_link"
            placeholder="Brochure Link"
            value={course.brochure_link ?? ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
  

      <Section title="Course Fees" cols={3}>
        <div className="flex flex-col">
          <label
            htmlFor="amount"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="Amount"
            value={course?.fees?.amount ?? ""}
            onChange={(e) => handleNestedChange(e, "fees")}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="currency"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={course.fees.currency ?? ""}
            onChange={(e) => handleNestedChange(e, "fees")}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Currency</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="year"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            placeholder="Year"
            value={course.fees.year ?? ""}
            onChange={(e) => handleNestedChange(e, "fees")}
            className="p-2 border rounded"
            required
          />
        </div>
      </Section>

      {/* <Section title="Ratings" cols={2}>
        <div className="flex flex-col">
          <label
            htmlFor="score"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Score (0–5)
          </label>
          <input
            id="score"
            type="number"
            name="score"
            placeholder="Enter Score"
            min="0"
            max="5"
            value={course.ratings.score ?? ""}
            onChange={(e) => handleNestedChange(e, "ratings")}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="reviews_count"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Reviews Count
          </label>
          <input
            id="reviews_count"
            type="number"
            name="reviews_count"
            placeholder="Enter Reviews Count"
            value={course.ratings.reviews_count ?? ""}
            onChange={(e) => handleNestedChange(e, "ratings")}
            className="p-2 border rounded"
          />
        </div>
      </Section> */}
      <Section title="Placements" cols={2}>
        <div className="flex flex-col">
          <label
            htmlFor="median_salary"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Median Salary
          </label>
          <input
            id="median_salary"
            type="number"
            name="median_salary"
            placeholder="Enter Median Salary"
            value={course.placements.median_salary ?? ""}
            onChange={(e) => handleNestedChange(e, "placements")}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="placement_rate"
            className="mb-1 font-semibold text-sm text-gray-700"
          >
            Placement Rate (%)
          </label>
          <input
            id="placement_rate"
            type="number"
            name="placement_rate"
            placeholder="Enter Placement Rate (%)"
            value={course.placements.placement_rate ?? ""}
            onChange={(e) => handleNestedChange(e, "placements")}
            className="p-2 border rounded"
          />
        </div>
      </Section>

      {/* <label className="block font-semibold mt-4">Entrance Exam</label>
      <input
        name="entrance_exam"
        value={course.entrance_exam ?? ""}
        onChange={handleChange}
        placeholder="Enter entrance exam name"
        className="p-2 border rounded w-full"
      /> */}
      <Section title="Intake Capacity" cols={3}>
        {["male", "female", "total"].map((field) => (
          <div key={field} className="flex flex-col">
            <label
              htmlFor={field}
              className="mb-1 font-semibold text-sm text-gray-700"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              type="number"
              name={field}
              placeholder={`Enter ${
                field.charAt(0).toUpperCase() + field.slice(1)
              } Intake`}
              value={
                course?.intake_capacity?.[
                  field as keyof typeof course.intake_capacity
                ] ?? ""
              }
              onChange={(e) => handleNestedChange(e, "intake_capacity")}
              className="p-2 border rounded"
            />
          </div>
        ))}
      </Section>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 mt-7 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        {loading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : courseId !== "new" ? (
          "Update Course"
        ) : (
          "Publish Course"
        )}
      </button>

      {courseId && courseId !== "new" && (
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white p-3 rounded-lg ml-4"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

const Section = ({
  title,
  cols,
  children,
}: {
  title: string;
  cols: number;
  children: ReactNode;
}) => {
  const gridClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
      ? "grid-cols-1 md:grid-cols-2"
      : cols === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1";

  return (
    <>
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <div className={`grid ${gridClass} gap-4`}>{children}</div>
    </>
  );
};

export default CourseForm;
