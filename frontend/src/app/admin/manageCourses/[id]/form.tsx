"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { College, Course } from "@/components/model/models";
import { Loader } from "lucide-react";
import ProgramModeDropdown from "@/components/programMode/page";
import SpecializationDropdown from "@/components/specializationDropdown/page";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

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
  const [selectedProgramMode, setSelectedProgramMode] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const [course, setCourse] = useState<Course>({
    name: "",
    description: "",
    college_id: "",
    category: "B.Tech",
    duration: "",
    // mode: "Full-Time",
    programMode: "",
    specialization: "",
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

  useEffect(() => {
    axios
      .get(`${api_url}get/colleges`)
      .then((res) => setColleges(res.data.data || []))
      .catch((err) => console.error("Error fetching colleges:", err));
  }, []);

  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const response = await axios.get(`${api_url}course-list`);
        setCourseList(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching course categories:", error);
      }
    };

    fetchCourseList();
  }, []);

useEffect(() => {
  if (courseId && courseId !== "new") {
    axios.get(`${api_url}courses/${courseId}`)
      .then(res => {
        const fetchedCourse = res.data || {};
        if (fetchedCourse.category && typeof fetchedCourse.category === "object") {
          fetchedCourse.category = fetchedCourse.category._id;
        }
        if (fetchedCourse.college_id && typeof fetchedCourse.college_id === "object") {
          fetchedCourse.college_id = fetchedCourse.college_id._id;
        }
        setCourse(fetchedCourse);
      })
      .catch(err => console.error(err));
  }
}, [courseId]);


const handleChange = useCallback(
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    console.log("Field changed:", e.target.name, "Value:", e.target.value); // <--- Add this line
    setCourse((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  },
  []
);


  const handleNestedChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      section: keyof Course
    ) => {
      setCourse((prev) => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${api_url}courses${
        courseId && courseId !== "new" ? `/${courseId}` : ""
      }`;
      const method = courseId && courseId !== "new" ? axios.put : axios.post;
      const res = await method(url, course);

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
    setSelectedProgramMode(e.target.value);
    setCourse((prev) => ({ ...prev, programMode: e.target.value }));
  };
  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSpecialization(e.target.value);
    setCourse((prev) => ({ ...prev, specialization: e.target.value }));
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[1580px] mx-auto p-4 border rounded-lg shadow"
    >
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {courseId && courseId !== "new" ? "Edit Course" : "Create New Course"}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4 mt-2">
          {/* <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700"
          >
            Course Name
          </label> */}
          <div className="flex flex-col">
            <SpecializationDropdown
              name="specialization"
              value={course.specialization ?? ""}
              onChange={handleSpecializationChange}
              label="Specialization"
              required
            />
          </div>

          {/* <input
            id="name"
            name="name"
            placeholder="Course Name"
            value={course.name ?? ""}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          
          /> */}
        </div>

        <div className="mb-4 mt-2">
          <label
            htmlFor="college_id"
            className="block text-sm font-semibold text-gray-700 pb-2"
          >
            Select College
          </label>

          <select
            id="college_id"
            name="college_id"
            value={course.college_id ?? ""}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required // <-- add this
          >
            <option value="">Select College</option>
            {colleges.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <label
          htmlFor="description"
          className="block text-sm mt-[-20px] font-semibold text-gray-700"
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
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700"
          >
            Degree
          </label>
       <select
  id="category"
  name="category"
  value={course.category ?? ""}
  onChange={handleChange}
  className="p-2 border rounded w-full"
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

        {/* <select
          name="mode"
          value={course.mode ?? ""}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          {["Full-Time", "Part-Time", "Online"].map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select> */}
        <ProgramModeDropdown
          name="programMode"
          value={course.programMode ?? ""}
          onChange={handleProgramModeChange}
          label="Program Mode"
          required={true} // add required here
        />

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

        <div className="mb-4">
          <label
            htmlFor="enrollmentLink"
            className="block text-sm font-semibold text-gray-700"
          >
            Enrollment Link
          </label>
          <input
            id="enrollmentLink"
            name="enrollmentLink"
            placeholder="Enrollment Link"
            value={course.enrollmentLink ?? ""}
            onChange={handleChange}
            className="p-2 border rounded w-full"
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

      <label className="block font-semibold mt-4">Entrance Exam</label>
      <input
        name="entrance_exam"
        value={course.entrance_exam ?? ""}
        onChange={handleChange}
        placeholder="Enter entrance exam name"
        className="p-2 border rounded w-full"
      />
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
  children: React.ReactNode;
}) => (
  <>
    <h3 className="text-xl font-semibold mt-4">{title}</h3>
    <div className={`grid grid-cols-${cols} gap-4`}>{children}</div>
  </>
);

export default CourseForm;
