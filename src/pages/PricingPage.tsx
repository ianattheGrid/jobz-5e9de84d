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
          <Card className="relative border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                For Employers
              </div>
            </div>
            <CardHeader className="text-center pt-8 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Hiring Company</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-red-500">£9</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {employerFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
              <div className="pt-6">
                <Link to="/employer/signup">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3">
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Pricing */}
          <Card className="relative border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                For Job Seekers
              </div>
            </div>
            <CardHeader className="text-center pt-8 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Candidate</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-green-500">£0</span>
                <span className="text-gray-600 ml-2">forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidateFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
              <div className="pt-6">
                <Link to="/candidate/signup">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3">
                    Join Free
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