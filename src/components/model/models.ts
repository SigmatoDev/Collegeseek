export interface College {
  _id: string;
  name: string;
}

export interface Course {
  name: string;
  description: string;
  college_id: string;
  category: string;
  duration: string;
  mode: string;
  fees: { amount: number; currency: string; year: number };
  eligibility: string;
  application_dates: { start_date: string; end_date: string };
  ratings: { score: number; reviews_count: number };
  placements: { median_salary: number; currency: string; placement_rate: number };
  intake_capacity: { male: number; female: number; total: number };
  entrance_exam: string;
  enrollmentLink: string;
  brochure_link: string;
}