// components/ThankYouPage.tsx
'use client';

import { CheckCircle2, Gift, Users, Calendar, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ThankYouPageProps {
  firstName?: string;
}

export default function ThankYouPage({ 
  firstName = "Guest",
}: ThankYouPageProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleViewEvents = () => {
    router.push('/events');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the Family, {firstName}!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your registration is complete! We're so excited to have you join us at AAGC.
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>Redirecting to home in {countdown} seconds...</span>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-green-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Registration Confirmed
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What happens next?
              </h2>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Confirmation email sent to your inbox</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Our team will contact you within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">You're added to our weekly newsletter</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">#001234</div>
              <div className="text-sm text-gray-600">Your Registration ID</div>
              <div className="mt-4 text-xs text-gray-500">Keep this for reference</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Next Steps at AAGC
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Welcome Gift",
                description: "Pick up your welcome package at the information desk",
                icon: <Gift className="w-6 h-6" />,
              },
              {
                title: "Newcomers Lunch",
                description: "Join us this Sunday after service",
                icon: <Users className="w-6 h-6" />,
                date: "This Sunday, 12:30 PM"
              },
              {
                title: "Next Steps Class",
                description: "Learn about our church and how to get involved",
                icon: <Calendar className="w-6 h-6" />,
                date: "April 15, 10:00 AM"
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                
                {step.date && (
                  <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    <Calendar className="w-3 h-3" />
                    {step.date}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToHome}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 rounded-xl border border-gray-300 shadow-sm hover:shadow transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Home (Now)
          </button>
          
          <button
            onClick={handleViewEvents}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            View Upcoming Events
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-gray-500 text-sm max-w-2xl mx-auto">
          <p className="mb-2">
            Need immediate assistance? Call us at <span className="text-green-600 font-medium">+234 123 456 7890</span>
          </p>
          <p>
            Or email us at <span className="text-green-600 font-medium">welcome@aagc.org</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}