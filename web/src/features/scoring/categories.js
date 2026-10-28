// The three score categories shown on every restaurant page.
// `field` is the matching column in the Supabase restaurants table.
// `description` is the "How this score works" text, supplied by Ewan.

export const SCORE_CATEGORIES = [
  {
    key: "food",
    field: "food_score",
    title: "Food Waste",
    description:
      "Measures how effectively a restaurant prevents and diverts food from landfill. The score is based on factors such as ingredient utilization, preparation practices, portion management, surplus recovery, and food donation, using information collected through EcoMeter assessments and tracking.",
  },
  {
    key: "packaging",
    field: "packaging_score",
    title: "Packaging Waste",
    description:
      "Measures how responsibly a restaurant manages the packaging associated with its food and beverage operations. We assess the types and quantities of packaging used, including reusable, recyclable, compostable, and landfill-bound materials, to determine how effectively packaging impacts are being reduced.",
  },
  {
    key: "supply",
    field: "supply_score",
    title: "Supplier Waste",
    description:
      "Measures how sustainably a restaurant sources its food and packaging. The score considers where products come from and the proportion sourced locally within BC, elsewhere in Canada, or internationally, along with other relevant supplier sustainability practices.",
  },
];
