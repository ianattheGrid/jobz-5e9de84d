
export const getTitlesForMarketingSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Digital Marketing":
      return [
        "Digital Marketing Manager",
        "Digital Marketing Specialist",
        "PPC Specialist",
        "Digital Campaign Manager"
      ];
    case "Content Marketing":
      return [
        "Content Marketing Manager",
        "Content Strategist",
        "Content Writer",
        "Content Creator"
      ];
    case "Social Media Marketing":
      return [
        "Social Media Manager",
        "Social Media Specialist",
        "Community Manager",
        "Social Media Coordinator"
      ];
    case "Brand Management":
      return [
        "Brand Manager",
        "Brand Strategist",
        "Brand Marketing Manager",
        "Brand Development Manager"
      ];
    case "Marketing Analytics":
      return [
        "Marketing Analytics Manager",
        "Marketing Data Analyst",
        "Marketing Intelligence Specialist",
        "Marketing Insights Manager"
      ];
    case "Product Marketing":
      return [
        "Product Marketing Manager",
        "Product Marketing Specialist",
        "Market Research Analyst",
        "Product Launch Manager"
      ];
    case "Email Marketing":
      return [
        "Email Marketing Manager",
        "Email Marketing Specialist",
        "CRM Manager",
        "Marketing Automation Specialist"
      ];
    case "SEO/SEM":
      return [
        "SEO Manager",
        "SEO Specialist",
        "SEM Manager",
        "Search Marketing Specialist"
      ];
    case "Marketing Strategy":
      return [
        "Marketing Strategy Manager",
        "Marketing Director",
        "Strategic Marketing Manager",
        "Growth Marketing Manager"
      ];
    case "Marketing Communications":
      return [
        "Marketing Communications Manager",
        "PR Manager",
        "Communications Specialist",
        "Marketing Communications Coordinator"
      ];
    default:
      return [];
  }
};
