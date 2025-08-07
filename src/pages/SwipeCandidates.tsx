import React from 'react';
import NavBar from "@/components/NavBar";
import { SwipeInterface } from "@/components/swipe/SwipeInterface";
import sarahProfileImage from "@/assets/sarah-johnson-profile.jpg";

export default function SwipeCandidates() {
  const candidatesData = [
    {
      name: "Sarah Johnson",
      title: "Senior Frontend Developer",
      location: "Bristol, UK",
      experience: "5+ years",
      summary: "Passionate frontend developer with 5+ years of experience building responsive web applications using React, TypeScript, and modern CSS.",
      skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Node.js"],
      image: sarahProfileImage
    },
    {
      name: "James Wilson",
      title: "Full Stack Developer",
      location: "Bristol, UK", 
      experience: "3+ years",
      summary: "Experienced full-stack developer specializing in modern web technologies and cloud deployment. Strong background in both frontend and backend development.",
      skills: ["React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker"]
    },
    {
      name: "Emma Thompson",
      title: "UX/UI Designer",
      location: "Bristol, UK",
      experience: "4+ years", 
      summary: "Creative UX/UI designer with a passion for creating intuitive and accessible user experiences. Expert in design systems and user research.",
      skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Design Systems"]
    },
    {
      name: "Michael Davis",
      title: "DevOps Engineer",
      location: "Bristol, UK",
      experience: "6+ years",
      summary: "Senior DevOps engineer with extensive experience in cloud infrastructure, automation, and continuous deployment pipelines.",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python"]
    },
    {
      name: "Sophie Brown",
      title: "Product Manager",
      location: "Bristol, UK", 
      experience: "7+ years",
      summary: "Strategic product manager with a track record of launching successful digital products. Expert in agile methodologies and user-centered design.",
      skills: ["Product Strategy", "Agile", "Scrum", "User Research", "Analytics", "Roadmapping"]
    }
  ];

  const handleMatch = (candidate: any) => {
    console.log('Matched with candidate:', candidate.name);
    // Here you would typically send this to your backend
  };

  const handlePass = (candidate: any) => {
    console.log('Passed on candidate:', candidate.name);
    // Here you would typically track this interaction
  };

  const handlePending = (candidate: any) => {
    console.log('Saved candidate for later:', candidate.name);
    // Here you would typically save this to a "maybe" list
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-2xl" style={{ paddingTop: '80px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Candidates</h1>
          <p className="text-muted-foreground">
            Pass • Maybe • Like - Find your perfect candidate match
          </p>
        </div>

        <SwipeInterface
          data={candidatesData}
          type="candidate"
          onMatch={handleMatch}
          onPass={handlePass}
          onPending={handlePending}
        />
      </div>
    </div>
  );
}