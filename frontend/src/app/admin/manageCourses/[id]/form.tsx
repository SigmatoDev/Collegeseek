"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { College, Course } from "@/components/model/models";
import { Loader } from "lucide-react";

const CourseForm = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return <ActualCourseForm />;
};

const ActualCourseForm = () => {
  const router = useRouter();
  const { id: courseId } = useParams();
  const [courseList, setCourseList] = useState<{ name: string }[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  const [course, setCourse] = useState<Course>({
    name: "",
    description: "",
    college_id: "",
    category: "B.Tech",
    duration: "",
    mode: "Full-Time",
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
      .get(`${api_url}f/college`)
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
      axios
        .get(`${api_url}courses/${courseId}`)
        .then((res) => setCourse(res.data || {}))
        .catch((err) => console.error("Error fetching course:", err));
    }
  }, [courseId]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
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
        alert(
          `Course ${courseId !== "new" ? "updated" : "added"} successfully!`
        );
        router.push("/admin/manageCourses");
      } else {
        alert("Failed to save course.");
      }
    } catch (err) {
      console.error("Error submitting course:", err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-8xl mx-auto p-4 border rounded-lg shadow"
    >
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {courseId && courseId !== "new" ? "Edit Course" : "Create New Course"}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Course Name"
          value={course.name ?? ""}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
       <select
  name="college_id"
  value={course.college_id ?? ""}
  onChange={handleChange}
  className="p-2 border rounded"
>
  <option value="">Select College</option>
  {colleges.map(({ _id, name }) => (
    <option key={_id} value={_id}>
      {name}
    </option>
  ))}
</select>

        <textarea
          name="description"
          placeholder="Description"
          value={course.description ?? ""}
          onChange={handleChange}
          className="p-2 border rounded col-span-2"
          rows={3}
          required
        />

        <select
          name="category"
          value={course.category}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Degree</option>
          {courseList.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="duration"
          placeholder="Duration"
          value={course.duration ?? ""}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <select
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
        </select>

        <input
          name="eligibility"
          placeholder="Eligibility"
          value={course.eligibility ?? ""}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="enrollmentLink"
          placeholder="Enrollment Link"
          value={course.enrollmentLink ?? ""}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="brochure_link"
          placeholder="Brochure Link"
          value={course.brochure_link ?? ""}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      <Section title="Fees" cols={3}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={course?.fees?.amount ?? ""}
          onChange={(e) => handleNestedChange(e, "fees")}
          className="p-2 border rounded"
          required
        />
        <select
          name="currency"
          value={course.fees.currency ?? ""}
          onChange={(e) => handleNestedChange(e, "fees")}
          className="p-2 border rounded"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={course.fees.year ?? ""}
          onChange={(e) => handleNestedChange(e, "fees")}
          className="p-2 border rounded"
          required
        />
      </Section>
      <Section title="Application Dates" cols={2}>
        {["start_date", "end_date"].map((date) => (
          <input
            key={date}
            type="date"
            name={date}
            value={
              course?.application_dates?.[
                date as keyof typeof course.application_dates
              ]?.split("T")[0] || ""
            }
            onChange={(e) => handleNestedChange(e, "application_dates")}
            className="p-2 border rounded"
          />
        ))}
      </Section>

      <Section title="Ratings" cols={2}>
        <div className="flex flex-col">
          <label
            htmlFor="score"
            className="mb-1 font-medium text-sm text-gray-700"
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
            className="mb-1 font-medium text-sm text-gray-700"
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
      </Section>

      <Section title="Placements" cols={3}>
        <div className="flex flex-col">
          <label
            htmlFor="median_salary"
            className="mb-1 font-medium text-sm text-gray-700"
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
            className="mb-1 font-medium text-sm text-gray-700"
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

      <label className="block font-medium mt-4">Entrance Exam</label>
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
              className="mb-1 font-medium text-sm text-gray-700"
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
