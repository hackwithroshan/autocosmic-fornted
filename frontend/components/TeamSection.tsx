
import React from 'react';
import { TeamMember } from '../types';
import TwitterIcon from './icons/TwitterIcon';

interface TeamSectionProps {
  title: string;
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ title, teamMembers = [] }) => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-bg-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading-cormorant mb-10">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map(member => (
            <div key={member.id} className="group">
              <div className="relative aspect-square w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg mb-4">
                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-zaina-primary">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;