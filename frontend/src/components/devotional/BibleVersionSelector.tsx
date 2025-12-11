// components/devotional/BibleVersionSelector.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const bibleVersions = [
  { value: 'NIV', label: 'New International Version' },
  { value: 'ESV', label: 'English Standard Version' },
  { value: 'KJV', label: 'King James Version' },
  { value: 'NKJV', label: 'New King James Version' },
  { value: 'NASB', label: 'New American Standard Bible' },
  { value: 'NLT', label: 'New Living Translation' },
  { value: 'CSB', label: 'Christian Standard Bible' },
  { value: 'MSG', label: 'The Message' },
];

interface BibleVersionSelectorProps {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}

export default function BibleVersionSelector({ selectedVersion, onVersionChange }: BibleVersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedVersionLabel = bibleVersions.find(v => v.value === selectedVersion)?.label || selectedVersion;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-green-500 transition-colors text-gray-700 font-medium"
      >
        <span className="text-sm">{selectedVersionLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 right-0 z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2">
            {bibleVersions.map(version => (
              <button
                key={version.value}
                onClick={() => {
                  onVersionChange(version.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedVersion === version.value
                    ? 'bg-green-50 text-green-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-medium">{version.value}</div>
                <div className="text-sm text-gray-500">{version.label}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}