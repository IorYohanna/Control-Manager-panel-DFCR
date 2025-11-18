import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import InfoCards from '../../components/ui/cards/InfoCards';
import { Sparkles } from 'lucide-react';

const HomePage = () => {
  const citations = [
    "Communiquer n'a jamais été aussi facile",
    "L'organisation commence par une bonne planification",
    "Chaque jour est une nouvelle opportunité",
    "Le succès se planifie, un événement à la fois",
    "Ensemble, nous sommes plus forts",
    "Votre temps est précieux, organisez-le bien",
    "La collaboration est la clé de la réussite",
    "Planifiez aujourd'hui pour un meilleur demain",
    "L'efficacité naît de l'organisation",
    "Transformez vos projets en réalité"
  ];

  const [citationActuelle, setCitationActuelle] = useState('');

  useEffect(() => {
    const citationAleatoire = citations[Math.floor(Math.random() * citations.length)];
    setCitationActuelle(citationAleatoire);
  }, []);

  return (
    <div className="w-full p-4 sm:p-6 overflow-auto">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 max-w-[1920px] mx-auto">
        
        {/* Section Calendrier */}
        <div className="xl:col-span-4 flex flex-col gap-2">
          {/* Citation du jour */}
          <div className="bg-linear-to-br from-[#f5ece3] to-white/90 rounded-2xl shadow-lg p-1 sm:p-2 border border-[#73839e]/10">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2 bg-gradient-to-br from-[#2d466e] to-[#3d5680] rounded-full">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#f5ece3]" />
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#2d466e] text-center">
                Citation du jour
              </h2>
              <p className="text-center text-sm sm:text-base text-[#73839e] italic font-medium animate-fadeIn">
                "{citationActuelle}"
              </p>
            </div>
            
          </div>

          {/* Calendrier */}
          <div className="flex-1">
            <Calendar />
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="hidden xl:block h-full">
          <div className="sticky top-6">
            <InfoCards />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;