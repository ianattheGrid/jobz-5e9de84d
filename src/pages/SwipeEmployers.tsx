import React from 'react';
import NavBar from "@/components/NavBar";
import { SwipeInterface } from "@/components/swipe/SwipeInterface";

export default function SwipeEmployers() {
  const employersData = [
    {
      name: "TechHub Bristol",
      industry: "Technology",
      location: "Bristol, UK",
      employees: "50-100",
      description: "Leading technology consultancy specializing in digital transformation and custom software development for enterprise clients.",
      openPositions: [
        { title: "Senior Frontend Developer", salary: "£50,000 - £65,000" },
        { title: "DevOps Engineer", salary: "£45,000 - £60,000" },
        { title: "Product Manager", salary: "£55,000 - £70,000" }
      ]
    },
    {
      name: "Digital West Ltd.",
      industry: "Digital Marketing",
      location: "Bristol, UK",
      employees: "20-50",
      description: "Creative digital marketing agency helping businesses grow their online presence through innovative strategies and cutting-edge technology.",
      openPositions: [
        { title: "UX/UI Designer", salary: "£35,000 - £45,000" },
        { title: "Frontend Developer", salary: "£40,000 - £50,000" }
      ]
    },
    {
      name: "Bristol Startups",
      industry: "Startup Incubator",
      location: "Bristol, UK", 
      employees: "10-20",
      description: "Dynamic startup incubator fostering innovation and supporting early-stage companies in the Bristol tech ecosystem.",
      openPositions: [
        { title: "Full Stack Developer", salary: "£30,000 - £40,000" },
        { title: "Marketing Specialist", salary: "£25,000 - £35,000" }
      ]
    },
    {
      name: "FinTech Bristol",
      industry: "Financial Technology",
      location: "Bristol, UK",
      employees: "100+",
      description: "Innovative fintech company revolutionizing financial services through blockchain technology and AI-powered solutions.",
      openPositions: [
        { title: "Senior Backend Developer", salary: "£60,000 - £80,000" },
        { title: "Data Scientist", salary: "£55,000 - £75,000" },
        { title: "Security Engineer", salary: "£65,000 - £85,000" }
      ]
    },
    {
      name: "GreenTech Solutions",
      industry: "Clean Technology",
      location: "Bristol, UK",
      employees: "30-50", 
      description: "Sustainable technology company developing IoT solutions for smart cities and environmental monitoring systems.",
      openPositions: [
        { title: "IoT Developer", salary: "£45,000 - £55,000" },
        { title: "Systems Architect", salary: "£70,000 - £90,000" }
      ]
    }
  ];

  const handleMatch = (employer: any) => {
    console.log('Interested in employer:', employer.name);
    // Here you would typically send this to your backend
  };

  const handlePass = (employer: any) => {
    console.log('Passed on employer:', employer.name);
    // Here you would typically track this interaction
  };

  const handlePending = (employer: any) => {
    console.log('Saved employer for later:', employer.name);
    // Here you would typically save this to a "maybe" list
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-2xl" style={{ paddingTop: '80px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Employers</h1>
          <p className="text-muted-foreground">
            Pass • Maybe • Like - Find your perfect employer match
          </p>
        </div>

        <SwipeInterface
          data={employersData}
          type="employer"
          onMatch={handleMatch}
          onPass={handlePass}
          onPending={handlePending}
        />
      </div>
    </div>
  );
}