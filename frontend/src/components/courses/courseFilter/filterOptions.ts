export interface FilterRangeOption {
  id: string;
  label: string;
  min?: number;
  max?: number;
}

export const feeRangeOptions: FilterRangeOption[] = [
  { id: "fee_lt_1", label: "Below ₹1 Lakh", max: 100000 },
  { id: "fee_1_3", label: "₹1L - ₹3L", min: 100000, max: 300000 },
  { id: "fee_3_5", label: "₹3L - ₹5L", min: 300000, max: 500000 },
  { id: "fee_gt_5", label: "Above ₹5 Lakh", min: 500000 },
];

export const durationRangeOptions: FilterRangeOption[] = [
  { id: "dur_short", label: "Up to 2 Years", max: 2 },
  { id: "dur_mid", label: "3 - 4 Years", min: 3, max: 4 },
  { id: "dur_long", label: "5+ Years", min: 5 },
];
