"use client";

import { useEffect, useState } from "react";
import { api_url } from "@/utils/apiCall";

export interface DegreeOption {
  _id: string;
  name: string;
}

export const useCourseFilters = () => {
  const [degrees, setDegrees] = useState<DegreeOption[]>([]);
  const [programModes, setProgramModes] = useState<DegreeOption[]>([]);
  const [courseNames, setCourseNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseRes = await fetch(`${api_url}c/courses`);
        const courseData = await courseRes.json();

        // Degrees
        const degreeMap = new Map<string, string>();
        courseData.forEach((course: any) => {
          if (course.category && course.category._id && course.category.name) {
            degreeMap.set(course.category._id, course.category.name);
          }
        });
        const degreeList = Array.from(degreeMap.entries()).map(([id, name]) => ({
          _id: id,
          name,
        }));
        setDegrees(degreeList);

        // Program Modes
        const programModeMap = new Map<string, string>();
        courseData.forEach((course: any) => {
          if (course.programMode && course.programMode._id && course.programMode.name) {
            programModeMap.set(course.programMode._id, course.programMode.name);
          }
        });
        const programModeList = Array.from(programModeMap.entries()).map(([id, name]) => ({
          _id: id,
          name,
        }));
        setProgramModes(programModeList);

        // Course Names
        const uniqueNames = Array.from(
          new Set(courseData.map((course: any) => course.name).filter(Boolean))
        ) as string[];
        setCourseNames(uniqueNames);

      } catch (error) {
        console.error("Error fetching course filters:", error);
      }
    };

    fetchCourses();
  }, []);

  return {
    degrees,
    programModes,
    courseNames,
  };
};
