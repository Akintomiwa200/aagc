import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const FirstTimer: React.FC = () => {
  return (
    <div className="pb-24 p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-900 dark:text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Here?</h1>
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl text-center space-y-4">
        <h2 className="text-xl font-bold text-primary-900 dark:text-primary-100">Welcome Home!</h2>
        <p className="text-gray-700 dark:text-gray-300">We are so excited to have you join our family. Please fill out this short form so we can connect with you.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input type="text" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 dark:text-white" placeholder="John Doe" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 dark:text-white" placeholder="john@example.com" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input type="tel" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 dark:text-white" placeholder="+1 234 567 8900" />
        </div>
        <Button fullWidth size="lg">Submit</Button>
      </form>
    </div>
  );
};
