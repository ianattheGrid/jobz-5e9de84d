import { useEffect } from "react";
import { Link } from "react-router-dom";
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
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import sarahProfileImage from "@/assets/sarah-johnson-profile.jpg";

export default function DemoCandidateProfile() {
  const candidate = {
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    location: "Bristol, UK",
    email: "sarah.johnson@example.com",
    phone: "+44 117 456 7890",
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
        company: "TechHub Bristol",
        period: "2022 - Present",
        description: "Lead frontend development for enterprise dashboard application serving 50k+ users. Implemented responsive design system and improved page load times by 40%."
      },
      {
        title: "Frontend Developer",
        company: "Digital West Ltd.",
        period: "2020 - 2022",
        description: "Developed customer-facing web applications using React and TypeScript. Collaborated with UX team to implement accessibility standards."
      },
      {
        title: "Junior Web Developer",
        company: "Bristol Startups",
        period: "2019 - 2020",
        description: "Built responsive websites and landing pages. Gained experience with modern frontend frameworks and build tools."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of Bristol",
        year: "2019"
      }
    ],
    certifications: [
      "AWS Certified Developer Associate",
      "Google Analytics Certified"
    ],
    personality: [
      { label: "Best holiday I’ve taken", answer: "Road-tripping the Scottish Highlands in autumn." },
      { label: "Favorite book", answer: "Atomic Habits — small wins, big results." },
      { label: "Best concert I’ve been to", answer: "Coldplay at Wembley — pure energy." },
      { label: "A small thing that makes my day", answer: "Perfectly brewed flat white." },
      { label: "My go-to way to learn something new", answer: "Build a tiny project and ship it." },
      { label: "What teammates can expect from me", answer: "Thoughtful PRs and zero-blame debugging." }
    ]
  };

  useEffect(() => {
    document.title = "Candidate Profile: Sarah Johnson | Jobz";
    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    ensureMeta(
      'description',
      "View Sarah Johnson’s profile: Senior Frontend Developer in Bristol, UK — skills, experience, education, and personality snapshots."
    );
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.origin + '/demo/candidate';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl" style={{ paddingTop: '80px' }}>
      
      {/* Back to Card Link */}
      <div className="mb-4">
        <Link 
          to="/#interactive-cards" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Interactive Cards</span>
        </Link>
      </div>
      <div className="mb-6 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
        <h2 className="text-lg font-semibold text-pink-800 mb-2">Demo Candidate Profile</h2>
        <p className="text-pink-700 mb-3">
          This is an example of how a candidate profile looks on Jobz. Real profiles would be created by actual job seekers.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/swipe/employers'}>
            🔥 Try Swipe Interface (Employers)
          </Button>
          <Link to="/preview/candidate-demo">
            <Button variant="secondary" size="sm">Preview with real components</Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="demo-candidate-dark">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/10">
                  <img 
                    src={sarahProfileImage} 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
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
                  <Badge key={index} variant="secondary" className="text-primary">
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

          {/* Personality */}
          {candidate.personality && candidate.personality.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {candidate.personality.map((item, idx) => (
                    <div key={idx} className="rounded-md border border-pink-200 bg-pink-50 p-4">
                      <div className="text-xs font-medium text-pink-700">{item.label}</div>
                      <div className="mt-1 text-gray-800">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
    </div>
  );
}