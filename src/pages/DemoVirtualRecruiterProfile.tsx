import { useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Zap, Target, Users, TrendingUp, Award, Calendar, MessageCircle, Clock, CheckCircle, Star, ArrowLeft } from "lucide-react";
export default function DemoVirtualRecruiterProfile() {
  const vr = {
    name: "Alex AI",
    title: "Senior Virtual Recruiter",
    specialization: "Tech & Engineering Roles",
    experience: "2+ years active",
    successRate: 87,
    placementCount: 156,
    avgTimeToHire: "14 days",
    clientSatisfaction: 4.8,
    languages: ["English", "Spanish", "French"],
    availability: "24/7",
    description: "I'm Alex AI, your dedicated virtual recruiting assistant. I specialize in matching top tech talent with innovative companies. Using advanced AI algorithms, I can identify the perfect candidates for your roles while ensuring cultural fit and technical competency.",
    expertise: ["Software Development", "Data Science", "DevOps & Cloud", "Product Management", "UI/UX Design", "Cybersecurity"],
    services: [{
      name: "Candidate Sourcing",
      description: "AI-powered search across multiple platforms",
      efficiency: 95
    }, {
      name: "Profile Screening",
      description: "Automated technical and cultural fit assessment",
      efficiency: 89
    }, {
      name: "Interview Scheduling",
      description: "Coordinated scheduling with all stakeholders",
      efficiency: 98
    }, {
      name: "Communication",
      description: "Regular updates and candidate engagement",
      efficiency: 92
    }],
    recentPlacements: [{
      role: "Senior React Developer",
      company: "Bristol Tech Hub",
      timeToHire: "12 days",
      salary: "£65k"
    }, {
      role: "DevOps Engineer",
      company: "West Country Digital",
      timeToHire: "8 days",
      salary: "£58k"
    }, {
      role: "Product Manager",
      company: "InnovateBristol",
      timeToHire: "16 days",
      salary: "£70k"
    }],
    stats: {
      activeSearches: 12,
      candidatesInPipeline: 47,
      interviewsScheduled: 8,
      offersExtended: 3
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-6xl" style={{
      paddingTop: '80px'
    }}>
      
      {/* Back to Card Link */}
      <div className="mb-4">
        <Link 
          to="/" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/#interactive-cards';
          }}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Interactive Cards</span>
        </Link>
      </div>
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
        <h2 className="text-lg font-semibold text-purple-800 mb-2">Demo Virtual Recruiter Profile</h2>
        <p className="text-purple-700">This is an example of how a Connector profile looks on Jobz. </p>
      </div>

      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{vr.name}</h1>
                <Badge className="bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground mb-2">{vr.title}</p>
              <p className="text-lg text-primary font-medium mb-4">{vr.specialization}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{vr.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{vr.placementCount}</p>
                  <p className="text-xs text-muted-foreground">Placements</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{vr.avgTimeToHire}</p>
                  <p className="text-xs text-muted-foreground">Avg Hire Time</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{vr.clientSatisfaction}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Client Rating</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Conversation
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {vr.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Service Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vr.services.map((service, index) => <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{service.name}</h3>
                      <span className="text-sm font-bold text-green-600">{service.efficiency}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                    <Progress value={service.efficiency} className="h-2" />
                  </div>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Successful Placements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vr.recentPlacements.map((placement, index) => <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{placement.role}</h3>
                        <p className="text-primary font-medium">{placement.company}</p>
                      </div>
                      <Badge variant="secondary">{placement.timeToHire}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Salary: {placement.salary}</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Active Searches</span>
                  <span className="font-semibold">{vr.stats.activeSearches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Candidates in Pipeline</span>
                  <span className="font-semibold">{vr.stats.candidatesInPipeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Interviews Scheduled</span>
                  <span className="font-semibold">{vr.stats.interviewsScheduled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Offers Extended</span>
                  <span className="font-semibold">{vr.stats.offersExtended}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expertise Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {vr.expertise.map((skill, index) => <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Available {vr.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Multi-language support</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Real-time market insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Instant candidate matching</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vr.languages.map((language, index) => <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{language}</span>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>;
}