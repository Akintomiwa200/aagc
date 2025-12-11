// components/forms/FirstTimerForm.tsx
'use client';

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Heart, AlertCircle, CheckCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  prayerRequest: string;
  wantFollowUp: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

interface FirstTimerFormProps {
  onSuccess?: (firstName: string) => void;
  onLoading?: (isLoading: boolean) => void;
}

export default function FirstTimerForm({ onSuccess, onLoading }: FirstTimerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    prayerRequest: '',
    wantFollowUp: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Automatically set today's date
  const [visitDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      const checked = target.checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    setSubmitError(null);
    
    if (!validateForm()) {
      return;
    }

    // Notify parent about loading
    if (onLoading) onLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response
      const mockApiResponse = {
        success: true,
        data: {
          id: 'REG-' + Date.now(),
          timestamp: new Date().toISOString(),
          visitDate: visitDate,
          ...formData
        }
      };
      
      if (mockApiResponse.success) {
        console.log('Form submitted successfully:', mockApiResponse.data);
        
        // Set submitted state
        setIsSubmitted(true);
        
        // Notify parent about success
        if (onSuccess) onSuccess(formData.firstName);
        
      } else {
        throw new Error('Submission failed');
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit form. Please try again.'
      );
      
    } finally {
      // Notify parent about loading complete
      if (onLoading) onLoading(false);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      prayerRequest: '',
      wantFollowUp: false
    });
    setErrors({});
    setSubmitError(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 text-center space-y-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to AAGC, {formData.firstName}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for registering as a first-time guest. We're excited to have you with us!
              {formData.wantFollowUp && " Someone from our team will reach out to you soon."}
            </p>
            <p className="text-sm text-gray-500">
              Visit Date: {new Date(visitDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <button
            onClick={resetForm}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Register Another Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-green-200 shadow-sm">
          <Heart className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-600">First Time Guest Registration</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
          Welcome to AAGC!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're excited to have you with us. Fill in your details so we can welcome you properly!
        </p>
        
        <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-green-800">
            Today's Date: {new Date(visitDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
{/* Form */}
<div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 space-y-8 max-w-6xl mx-auto">
  {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-green-600" />
            Personal Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition`}
                  placeholder="+234 123 456 7890"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City (Optional)
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                placeholder="Lagos"
              />
            </div>
          </div>
        </div>

        {/* Prayer Request */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-green-600" />
            Prayer Request (Optional)
          </h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              How can we pray for you?
            </label>
            <textarea
              name="prayerRequest"
              value={formData.prayerRequest}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none"
              placeholder="Share your prayer request with us..."
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="wantFollowUp"
              checked={formData.wantFollowUp}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-0.5"
            />
            <span className="text-gray-700 text-sm">
              Yes, I would like someone from the church to follow up with me about my visit
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error: {submitError}</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Please check your information and try again.
              </p>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            type="button"
            disabled={!!submitError}
            className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
          >
            Submit Registration
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            We value your privacy. Your information will only be used to connect with you about church activities.
          </p>
        </div>
      </div>
    </>
  );
}