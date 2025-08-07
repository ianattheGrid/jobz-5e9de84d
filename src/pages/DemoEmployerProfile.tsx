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
  Globe, 
  Users, 
  Building, 
  Calendar,
  Briefcase,
  Star,
  MessageCircle,
  ExternalLink,
  ArrowLeft
} from "lucide-react";

export default function DemoEmployerProfile() {
  const employer = {
    name: "Bristol Tech Solutions",
    industry: "Software Development",
    location: "Bristol, UK",
    email: "careers@bristoltech.co.uk",
    phone: "+44 117 123 4567",
    website: "www.bristoltech.co.uk",
    founded: "2018",
    size: "50-200 employees",
    description: "Bristol Tech Solutions is a fast-growing software company specializing in cloud-native solutions and AI-powered analytics. We're passionate about innovation and building products that make a real difference in our clients' businesses.",
    culture: "We believe in work-life balance, continuous learning, and collaborative innovation. Our team is diverse, inclusive, and driven by curiosity.",
    benefits: [
      "Competitive salary + pension",
      "Private healthcare",
      "25 days holiday + bank holidays",
      "Flexible working hours",
      "Remote work options",
      "Learning & development budget",
      "Company shares scheme",
      "Free lunch and refreshments"
    ],
    values: [
      "Innovation", "Collaboration", "Integrity", "Growth Mindset", "Customer Focus"
    ],
    openPositions: [
      {
        title: "Senior React Developer",
        department: "Engineering",
        location: "Bristol, UK / Remote",
        type: "Full-time",
        posted: "2 days ago",
        salary: "£55k - £70k"
      },
      {
        title: "Product Manager",
        department: "Product",
        location: "Bristol, UK",
        type: "Full-time",
        posted: "1 week ago",
        salary: "£60k - £75k"
      },
      {
        title: "DevOps Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        posted: "3 days ago",
        salary: "£50k - £65k"
      }
    ],
    stats: {
      totalEmployees: 125,
      avgRating: 4.6,
      responseRate: "95%",
      avgResponseTime: "2 days"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-6xl" style={{ paddingTop: '80px' }}>
      
      {/* Back to Card Link */}
      <div className="mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Interactive Cards</span>
        </Link>
      </div>
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Demo Employer Profile</h2>
        <p className="text-green-700 mb-3">
          This is an example of how an employer profile looks on jobz. Real profiles would be created by actual companies.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/swipe/candidates'}>
            🔥 Try Swipe Interface (Candidates)
          </Button>
        </div>
      </div>

      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="w-16 h-16 text-primary" />
              </div>
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-2">{employer.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{employer.industry}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employer.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employer.website}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Employer
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{employer.stats.avgRating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Company Rating</p>
                    <Separator />
                    <div>
                      <p className="font-semibold">{employer.stats.responseRate}</p>
                      <p className="text-xs text-muted-foreground">Response Rate</p>
                    </div>
                    <div>
                      <p className="font-semibold">{employer.stats.avgResponseTime}</p>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {employer.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {employer.culture}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Open Positions ({employer.openPositions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employer.openPositions.map((position, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{position.title}</h3>
                        <p className="text-primary font-medium">{position.department}</p>
                      </div>
                      <Badge variant="outline">{position.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Posted {position.posted}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-600">{position.salary}</span>
                      <Button size="sm">Apply Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employer.values.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employer.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Founded</p>
                  <p className="text-sm text-muted-foreground">{employer.founded}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Employees</p>
                  <p className="text-sm text-muted-foreground">{employer.stats.totalEmployees}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Industry</p>
                  <p className="text-sm text-muted-foreground">{employer.industry}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}