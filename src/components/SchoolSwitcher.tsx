import { useState } from 'react';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { multiSchoolStorage } from '../lib/multiSchoolStorage';
import type { School } from '../types';

export function SchoolSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const schools = multiSchoolStorage.getAllSchools();
  const activeSchool = multiSchoolStorage.getActiveSchool();

  const handleSwitch = (schoolId: string) => {
    multiSchoolStorage.switchSchool(schoolId);
    setIsOpen(false);
  };

  if (schools.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all shadow-sm"
      >
        <Building2 className="w-5 h-5 text-gray-600" />
        <div className="flex items-center gap-2">
          <img
            src={activeSchool.logo}
            alt={activeSchool.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">{activeSchool.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-20 min-w-[280px]">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Switch School Portal
              </div>
              {schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSwitch(school.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    school.id === activeSchool.id
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{school.name}</div>
                    <div className="text-xs text-gray-500">{school.tagline}</div>
                  </div>
                  {school.id === activeSchool.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
