// app/join/page.tsx
'use client';

import FirstTimerForm from '@/components/forms/FirstTimerForm';
import ThankYouPage from '@/components/ui/ThankYouPage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function JoinPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleFormSubmitSuccess = (firstName: string) => {
    setUserFirstName(firstName);
    setIsSubmitted(true);
    
    // Redirect to home after 5 seconds
    setTimeout(() => {
      router.push('/');
    }, 5000);
  };

  const handleFormLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isSubmitted) {
    return <ThankYouPage firstName={userFirstName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button at the page level */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 font-medium rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <FirstTimerForm 
          onSuccess={handleFormSubmitSuccess}
          onLoading={handleFormLoading}
        />
      </div>
    </div>
  );
}