import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_DEPARTMENTS } from '../constants';

export const About: React.FC = () => {
  const [openDept, setOpenDept] = useState<string | null>(null);

  const toggleDept = (id: string) => {
    setOpenDept(openDept === id ? null : id);
  };

  return (
    <div className="pb-24 p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="text-gray-900 dark:text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Us</h1>
      </div>

      <section className="space-y-4">
        <img src="https://picsum.photos/800/400?grayscale" className="w-full h-48 object-cover rounded-2xl" alt="Church Building" />
        <div className="prose dark:prose-invert text-sm text-gray-600 dark:text-gray-300">
            <p>Welcome to GraceMobile Church, a community dedicated to loving God and loving people. Our mission is to spread the light of the Gospel to every corner of our city.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Departments</h2>
        <div className="space-y-2">
            {MOCK_DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={() => toggleDept(dept.id)}
                        className="w-full flex items-center justify-between p-4 text-left"
                    >
                        <span className="font-medium text-gray-900 dark:text-white">{dept.name}</span>
                        {openDept === dept.id ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                    </button>
                    {openDept === dept.id && (
                        <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-300 animate-fade-in">
                            <p className="mb-2">{dept.description}</p>
                            <p className="font-medium text-primary-600 dark:text-primary-400">Lead: {dept.head}</p>
                            <p className="text-xs text-gray-500 mt-1">Meets: {dept.meetingTime}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};
