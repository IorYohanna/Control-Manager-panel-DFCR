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
    const citationAleatoire =
      citations[Math.floor(Math.random() * citations.length)];
    setCitationActuelle(citationAleatoire);
  }, []);

  return (
    <div className="h-screen max-w-[1920px] mx-auto flex flex-col ">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 thin-scrollbar">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

          <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4">

            <div className="bg-linear-to-br from-[#f5ece3] to-white/90 rounded-2xl shadow-lg p-4 sm:p-5 border border-[#73839e]/10">
              <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-3 flex-wrap">

                <div className="p-2 bg-linear-to-br from-[#2d466e] to-[#3d5680] rounded-full">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#f5ece3]" />
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#2d466e] text-center">
                  Citation du jour
                </h2>

                <p className="w-full sm:w-auto text-center text-sm sm:text-base lg:text-lg text-[#73839e] italic font-medium animate-fadeIn leading-snug">
                  “{citationActuelle}”
                </p>

              </div>
            </div>

            <div className="w-full">
              <Calendar />
            </div>
          </div>

          <div className="lg:col-span-2 xl:col-span-1 w-full">
            <InfoCards />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
