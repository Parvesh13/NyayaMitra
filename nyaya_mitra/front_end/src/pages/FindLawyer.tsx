
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import LawyerCard from '@/components/LawyerCard';

import { lawyers } from '../components/data/lawyersData';
type Lawyer = {
  id: number;
  name: string;
  specialization: string;
  location: string;
  contact: { email: string; phone: string };
  bio: string;
  imageUrl: string;
  yearsOfExperience: number;
};

const FindLawyer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'location' | 'specialization'>('location');

  const filteredLawyers = lawyers.filter((lawyer) => {
    const searchValue = searchTerm.toLowerCase();
    if (filterBy === 'location') {
      return lawyer.location.toLowerCase().includes(searchValue);
    } else {
      return lawyer.specialization.toLowerCase().includes(searchValue);
    }
  });

  return (
    <PageLayout>
      <SEO title="Find a Lawyer" description="Search for specialized lawyers in your area" />
      <div className="container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Find a Lawyer</h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Connect with experienced legal professionals specializing in various fields of law.
          Use our search tool to find lawyers by location or area of expertise.
        </p>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative flex items-center mb-6">
            <div className="absolute left-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search by ${filterBy}`}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <button 
              className={`px-4 py-2 rounded-full ${filterBy === 'location' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilterBy('location')}
            >
              Search by Location
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${filterBy === 'specialization' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilterBy('specialization')}
            >
              Search by Specialization
            </button>
          </div>

          {searchTerm && filteredLawyers.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-800">No lawyers found</h3>
              <p className="text-gray-600 mt-2">Try changing your search terms or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(searchTerm ? filteredLawyers : lawyers).map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FindLawyer;
