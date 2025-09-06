
import React from 'react';
import { PricingPlan } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface PricingTableSectionProps {
  title?: string;
  plans: PricingPlan[];
}

const PricingTableSection: React.FC<PricingTableSectionProps> = ({ title, plans = [] }) => {
  return (
    <section className="py-12 md:py-16 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light">
      <div className="container mx-auto px-4 text-center">
        {title && <h2 className="text-3xl font-bold font-heading-playfair mb-10">{title}</h2>}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div key={plan.id} className={`p-6 border rounded-lg text-left ${plan.isFeatured ? 'border-zaina-primary scale-105 bg-white' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold my-4">₹{plan.price}<span className="text-sm font-normal text-gray-500">{plan.frequency}</span></p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={plan.buttonLink} className={`w-full block text-center py-2 px-4 rounded-md font-semibold ${plan.isFeatured ? 'bg-zaina-primary text-white' : 'bg-gray-200 text-black'}`}>
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTableSection;