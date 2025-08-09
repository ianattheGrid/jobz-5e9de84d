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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import gallery1 from "@/assets/employer-gallery-1.jpg";
import gallery2 from "@/assets/employer-gallery-2.jpg";
import gallery3 from "@/assets/employer-gallery-3.jpg";
import gallery4 from "@/assets/employer-gallery-4.jpg";

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
  const gallery = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-6xl" style={{ paddingTop: '80px' }}>
      
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
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Demo Employer Profile</h2>
        <p className="text-green-700 mb-3">
          This is an example of how an employer profile looks on jobz. Real profiles would be created by actual companies.
        </p>
          <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/swipe/candidates'}>
            🔥 Try Swipe Interface (Candidates)
          </Button>
            <Link to="/preview/employer-demo">
              <Button variant="secondary" size="sm">Preview with real components</Button>
            </Link>
          </div>
      </div>

      {/* Hero Section */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#0b1437] via-[#14245a] to-[#1f2d72] text-white p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Building className="w-14 h-14 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{employer.name}</h1>
            <p className="text-lg text-white/80 mt-1">{employer.industry}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-white/85"><MapPin className="h-4 w-4" />{employer.location}</div>
              <div className="flex items-center gap-2 text-white/85"><Users className="h-4 w-4" />{employer.size}</div>
              <div className="flex items-center gap-2 text-white/85"><Mail className="h-4 w-4" />{employer.email}</div>
              <div className="flex items-center gap-2 text-white/85"><Globe className="h-4 w-4" />{employer.website}</div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="bg-primary text-white hover:bg-primary/90">
                <MessageCircle className="h-4 w-4 mr-2" /> Contact Employer
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
            <div className="hover-scale animate-fade-in rounded-full border border-white/20 px-4 py-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" /><span className="font-semibold">{employer.stats.avgRating}</span><span className="text-white/70 text-xs">Rating</span>
            </div>
            <div className="hover-scale animate-fade-in rounded-full border border-white/20 px-4 py-2 flex items-center gap-2">
              <span className="font-semibold">{employer.stats.responseRate}</span><span className="text-white/70 text-xs">Response</span>
            </div>
            <div className="hover-scale animate-fade-in rounded-full border border-white/20 px-4 py-2 flex items-center gap-2">
              <span className="font-semibold">{employer.stats.avgResponseTime}</span><span className="text-white/70 text-xs">Avg Reply</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Section Nav */}
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6">
        <nav className="flex flex-wrap gap-2 py-2 text-sm">
          {[
            { href: '#about', label: 'About' },
            { href: '#gallery', label: 'Gallery' },
            { href: '#roles', label: 'Open Roles' },
            { href: '#values', label: 'Values' },
            { href: '#benefits', label: 'Benefits' },
            { href: '#info', label: 'Company Info' },
          ].map(link => (
            <a key={link.href} href={link.href} className="px-3 py-1 rounded-full hover:bg-muted/70 transition-colors">{link.label}</a>
          ))}
        </nav>
      </div>

      <div className="demo-employer-dark">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card id="about">
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

          {/* Gallery */}
          <Card id="gallery" className="bg-[#0b1437] text-white">
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Carousel className="px-10">
                  <CarouselContent>
                    {gallery.map((src, idx) => (
                      <CarouselItem key={idx}>
                        <div className="w-full h-48 sm:h-56 overflow-hidden rounded-md">
                          <img src={src} alt={`Company gallery ${idx+1}`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious variant="outline" className="border-primary text-primary hover:bg-primary/10" />
                  <CarouselNext variant="outline" className="border-primary text-primary hover:bg-primary/10" />
                </Carousel>
              </div>
            </CardContent>
          </Card>

          <Card id="roles">
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
          <Card id="values">
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

          <Card id="benefits">
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

          <Card id="info">
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
    </div>
  );
}