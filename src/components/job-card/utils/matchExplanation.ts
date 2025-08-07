interface ScoreBreakdown {
  title: number;
  specialization: number;
  location: number;
  experience: number;
  salary: number;
  total: number;
}

export const generateMatchExplanation = (scoreBreakdown: ScoreBreakdown, job: any): string => {
  const explanations: string[] = [];
  
  // Title match explanation
  if (scoreBreakdown.title >= 80) {
    explanations.push("✅ Your job title strongly matches the position requirements");
  } else if (scoreBreakdown.title >= 50) {
    explanations.push("⚠️ Your job title partially matches the position");
  } else {
    explanations.push("❌ Your job title doesn't closely match the required position");
  }

  // Specialization match explanation
  if (scoreBreakdown.specialization >= 80) {
    explanations.push("✅ Your specialization aligns perfectly with the role");
  } else if (scoreBreakdown.specialization >= 50) {
    explanations.push("⚠️ Your specialization has some overlap with the requirements");
  } else {
    explanations.push("❌ Your specialization doesn't match the role requirements");
  }

  // Location match explanation
  if (scoreBreakdown.location >= 80) {
    explanations.push("✅ You're in the preferred location for this role");
  } else if (scoreBreakdown.location >= 50) {
    explanations.push("⚠️ Your location is close to the job requirements");
  } else {
    explanations.push("❌ Your location doesn't match the job location preferences");
  }

  // Experience match explanation
  if (scoreBreakdown.experience >= 80) {
    explanations.push("✅ Your experience level exceeds the minimum requirements");
  } else if (scoreBreakdown.experience >= 50) {
    explanations.push("⚠️ Your experience is close to the required level");
  } else {
    explanations.push("❌ You have less experience than typically required");
  }

  // Salary match explanation
  if (scoreBreakdown.salary >= 80) {
    explanations.push("✅ Your salary expectations align well with the offered range");
  } else if (scoreBreakdown.salary >= 50) {
    explanations.push("⚠️ Your salary expectations have some overlap with the offer");
  } else {
    explanations.push("❌ Your salary expectations don't align with the offered range");
  }

  return explanations.join('\n');
};

export const getMatchDescription = (percentage: number): string => {
  if (percentage >= 90) return "Excellent Match";
  if (percentage >= 80) return "Strong Match";
  if (percentage >= 70) return "Good Match";
  if (percentage >= 60) return "Fair Match";
  return "Weak Match";
};

export const getMatchColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-red-600";
};