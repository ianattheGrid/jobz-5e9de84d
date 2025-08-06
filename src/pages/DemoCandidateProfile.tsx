import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  Briefcase,
  Star,
  Download,
  MessageCircle
} from "lucide-react";

export default function DemoCandidateProfile() {
  const candidate = {
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    experience: "5+ years",
    availability: "Available immediately",
    summary: "Passionate frontend developer with 5+ years of experience building responsive web applications using React, TypeScript, and modern CSS. Strong advocate for clean code, accessibility, and user-centered design.",
    skills: [
      "React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS",
      "Next.js", "Node.js", "Git", "Figma", "Jest", "Cypress"
    ],
    experience_items: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        period: "2022 - Present",
        description: "Lead frontend development for enterprise dashboard application serving 50k+ users. Implemented responsive design system and improved page load times by 40%."
      },
      {
        title: "Frontend Developer",
        company: "Digital Solutions Ltd.",
        period: "2020 - 2022",
        description: "Developed customer-facing web applications using React and TypeScript. Collaborated with UX team to implement accessibility standards."
      },
      {
        title: "Junior Web Developer",
        company: "StartupXYZ",
        period: "2019 - 2020",
        description: "Built responsive websites and landing pages. Gained experience with modern frontend frameworks and build tools."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        year: "2019"
      }
    ],
    certifications: [
      "AWS Certified Developer Associate",
      "Google Analytics Certified"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl" style={{ paddingTop: '80px' }}>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Demo Candidate Profile</h2>
        <p className="text-blue-700">
          This is an example of how a candidate profile looks on jobz. Real profiles would be created by actual job seekers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">SJ</span>
                </div>
                <h1 className="text-2xl font-bold">{candidate.name}</h1>
                <p className="text-lg text-muted-foreground">{candidate.title}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{candidate.location}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.experience}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.availability}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Candidate
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {candidate.summary}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {candidate.experience_items.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      <Badge variant="outline">{exp.period}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {exp.description}
                    </p>
                    {index < candidate.experience_items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-primary font-medium">{edu.school}</p>
                    <p className="text-muted-foreground text-sm">{edu.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {candidate.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}