import { ProfileCard } from "./ProfileCard";
import sarahProfileImage from "@/assets/sarah-johnson-profile.jpg";
import bristolTechImage from "@/assets/bristol-tech-building.jpg";
import alexAiImage from "@/assets/alex-ai-avatar.jpg";

export const DemoCardsSection = () => {
  const candidateData = {
    type: "candidate" as const,
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    location: "Bristol, UK",
    image: sarahProfileImage,
    rating: 4.8,
    company: "Previously at TechCorp",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    description: "Passionate frontend developer with 6+ years of experience building scalable web applications. Expertise in React ecosystem, modern JavaScript, and cloud technologies. Led development of user-facing features serving 100k+ users. Strong advocate for clean code, testing, and user experience. Looking for senior roles where I can mentor junior developers and contribute to architectural decisions.",
    profileLink: "/demo/candidate",
    contactInfo: {
      email: "sarah.johnson@example.com",
      phone: "+44 7123 456789"
    }
  };

  const employerData = {
    type: "employer" as const,
    name: "Bristol Tech Solutions",
    title: "Software Development Company",
    location: "Bristol, UK",
    image: bristolTechImage,
    rating: 4.6,
    specialization: "Full-stack development, cloud solutions",
    description: "Innovative software development company specializing in cutting-edge web applications and cloud solutions. We're a team of 50+ passionate developers, designers, and product managers working with startups and established businesses. Our culture emphasizes work-life balance, continuous learning, and technical excellence. We offer competitive salaries, flexible working arrangements, and opportunities to work on diverse, challenging projects.",
    profileLink: "/demo/employer",
    contactInfo: {
      email: "careers@bristoltech.com",
      phone: "+44 117 123 4567"
    }
  };

  const vrData = {
    type: "virtual-recruiter" as const,
    name: "Alex AI",
    title: "Senior Virtual Recruiter",
    location: "UK-wide",
    image: alexAiImage,
    rating: 4.9,
    specialization: "Tech & Engineering Roles",
    description: "Advanced AI recruiter specialized in matching tech talent with innovative companies. Trained on 10,000+ successful placements in software development, data science, and engineering roles. I analyze candidate skills, cultural fit, and career aspirations to make precise matches. My success rate is 85% for placements lasting 12+ months. I provide 24/7 support throughout the recruitment process and ongoing career guidance.",
    profileLink: "/demo/virtual-recruiter"
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Profile Cards</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click any card to flip and see detailed information. This is how quick matching works on jobz.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ProfileCard {...candidateData} />
          <ProfileCard {...employerData} />
          <ProfileCard {...vrData} />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            💡 In the real app, you'd swipe through cards like these to find your perfect match
          </p>
        </div>
      </div>
    </section>
  );
};