"use client";

import { useEffect, useState } from "react";
import { api_url } from "@/utils/apiCall";

export const useCollegeFilters = () => {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [ranks, setRanks] = useState<number[]>([]);
  const [ownerships, setOwnerships] = useState<{ _id: string, name: string }[]>([]);
  const [affiliations, setAffiliations] = useState<{ _id: string, name: string }[]>([]);
  const [approvals, setApprovals] = useState<{ _id: string, code: string }[]>([]);
  const [exams, setExams] = useState<{ _id: string, code: string }[]>([]);
  const [streams, setStreams] = useState<{ _id: string, name: string }[]>([]);

  useEffect(() => {
    const fetchCollegeFilters = async () => {
      try {
        const collegeRes = await fetch(`${api_url}f/college`);
        const filterData = await collegeRes.json();
        console.log("collegeRes", filterData);

        setStates(filterData.states);
        setCities(filterData.cities);
        setRanks(filterData.ranks);
        setOwnerships(filterData.ownerships.map((item: any) => ({ _id: item._id, name: item.name })));
        setAffiliations(filterData.affiliations.map((item: any) => ({ _id: item._id, name: item.name })));
        setApprovals(filterData.approvals.map((item: any) => ({ _id: item._id, code: item.code })));
        setExams(filterData.exams.map((item: any) => ({ _id: item._id, code: item.code })));
        setStreams(filterData.streams.map((item: any) => ({ _id: item._id, name: item.name })));
      } catch (error) {
        console.error("Error fetching college filters:", error);
      }
    };

    fetchCollegeFilters();
  }, []);

  return {
    states,
    cities,
    ranks,
    ownerships,
    affiliations,
    approvals,
    exams,
    streams,
  };
};
