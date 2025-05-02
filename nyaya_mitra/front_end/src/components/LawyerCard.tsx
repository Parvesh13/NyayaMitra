
import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

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

interface LawyerCardProps {
  lawyer: Lawyer;
}

const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  return (
    <div className="bg-white dark:bg-[#1E1E32] rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="md:flex">
        <div className="md:w-1/3 h-64 md:h-auto relative">
          <img
            src={lawyer.imageUrl}
            alt={lawyer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{lawyer.name}</h3>
              <div className="inline-block bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-medium px-2.5 py-0.5 rounded mb-3">
                {lawyer.specialization}
              </div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lawyer.yearsOfExperience} {lawyer.yearsOfExperience === 1 ? 'year' : 'years'} exp.
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{lawyer.bio}</p>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="dark:text-gray-300">{lawyer.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
              <a href={`mailto:${lawyer.contact.email}`} className="text-primary dark:text-primary-light hover:underline">
                {lawyer.contact.email}
              </a>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
              <a href={`tel:${lawyer.contact.phone}`} className="text-primary dark:text-primary-light hover:underline">
                {lawyer.contact.phone}
              </a>
            </div>
          </div>
          
          <button className="mt-5 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors">
            Contact Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
