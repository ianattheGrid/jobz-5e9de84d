import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";

const PricingPage = () => {
  const employerFeatures = [
    "Hire candidates directly",
    "Candidate database",
    "Set up alerts",
    "Post unlimited jobs",
    "Anonymously use recruiters",
    "Automated hiring process",
    "Cancel anytime"
  ];

  const candidateFeatures = [
    "Create your free profile",
    "Apply directly to jobs",
    "Get discovered directly",
    "No high fee rejections",
    "Set up job alerts",
    "Earn bonuses",
    "Cancel anytime"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <NavBar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-12">
        {/* Beta Testing Notice */}
        <div className="bg-gradient-to-r from-blue-100 to-pink-100 border border-primary/20 rounded-lg p-6 mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Beta Testing in Bristol</h3>
            <Star className="h-5 w-5 text-primary" />
          </div>
          <p className="text-gray-700">
            We're currently beta testing in the Bristol area. During this period, <strong>all services are completely free!</strong> 
            Regular pricing will apply once we launch nationwide.
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works for you. No hidden fees, no long-term contracts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Employer Pricing */}
          <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-orange-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>
            
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white text-red-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-red-200">
                For Employers
              </div>
            </div>

            <CardHeader className="relative text-center pt-12 pb-4 text-white">
              <CardTitle className="text-3xl font-black mb-4 drop-shadow-2xl">Hiring Company</CardTitle>
              <div className="mt-4">
                <span className="text-6xl font-black drop-shadow-2xl">£9</span>
                <span className="text-xl ml-2 drop-shadow-lg">/month</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm inline-block">
                <span className="text-sm font-semibold">✨ Premium Access</span>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-3 px-6 pb-8 text-white">
              {employerFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-red-600 font-bold" />
                  </div>
                  <span className="font-medium drop-shadow-lg">{feature}</span>
                </div>
              ))}
              
              <div className="pt-6">
                <Link to="/employer/signup">
                  <Button className="w-full bg-white hover:bg-gray-100 text-red-600 py-4 text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/30">
                    🚀 Get Started Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Pricing */}
          <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>
            
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white text-green-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-green-200">
                For Job Seekers
              </div>
            </div>

            <CardHeader className="relative text-center pt-12 pb-4 text-white">
              <CardTitle className="text-3xl font-black mb-4 drop-shadow-2xl">Candidate</CardTitle>
              <div className="mt-4">
                <span className="text-6xl font-black drop-shadow-2xl">£0</span>
                <span className="text-xl ml-2 drop-shadow-lg">forever</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm inline-block">
                <span className="text-sm font-semibold">🎉 Always Free</span>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-3 px-6 pb-8 text-white">
              {candidateFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 font-bold" />
                  </div>
                  <span className="font-medium drop-shadow-lg">{feature}</span>
                </div>
              ))}
              
              <div className="pt-6">
                <Link to="/candidate/signup">
                  <Button className="w-full bg-white hover:bg-gray-100 text-green-600 py-4 text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/30">
                    💚 Join Free Today
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Is there really no charge during beta testing?</h3>
              <p className="text-gray-600">
                That's correct! While we're beta testing in Bristol, all services are completely free. 
                This includes unlimited job postings for employers and full access to all features.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">When will regular pricing start?</h3>
              <p className="text-gray-600">
                We'll announce the end of our free beta period well in advance. All existing users will receive 
                at least 30 days notice before any charges begin.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, absolutely. There are no long-term contracts. You can cancel your subscription at any time, 
                and you'll retain access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-pink-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join hundreds of employers and candidates in Bristol who are already using jobz to find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/employer/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
                I'm Hiring
              </Button>
            </Link>
            <Link to="/candidate/signup">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-3">
                I'm Job Seeking
              </Button>
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;