// The three score categories shown on every restaurant page.
// `field` is the matching column in the Supabase restaurants table.
// `description` is the "How this score works" text. Ewan is writing the
// final versions; the Food and Packaging text below are placeholders.
export const SCORE_CATEGORIES = [
  {
    key: "food",
    field: "food_score",
    title: "Food Waste",
    description:
      "This score compares how much food your kitchen throws away against your industry benchmark, based on prep waste, plate waste and how surplus food is donated or composted.",
  },
  {
    key: "packaging",
    field: "packaging_score",
    title: "Packaging Waste",
    description:
      "This score compares your packaging waste against your industry benchmark, based on single-use items, recyclable and compostable materials, and reusable container programs.",
  },
  {
    key: "supply",
    field: "supply_score",
    title: "Supplier Waste",
    description:
      "This score compares your supplier waste performance against your industry benchmark, based on weight of waste, diversion rate and waste reduction initiatives.",
  },
];
