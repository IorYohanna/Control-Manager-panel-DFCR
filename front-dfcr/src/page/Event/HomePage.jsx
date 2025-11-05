import React, { useEffect, useState } from 'react'
import Calendar from './Calendar'
import InfoCards from '../../components/ui/cards/InfoCards'

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
        <div className=' w-full p-6 bg-linear-to-br from-[#73839E] to-[#5a729b]'>
            <div className='grid grid-cols-1 xl:grid-cols-3  h-full gap-6'>
                <div className='xl:col-span-2 overflow-hidden flex flex-col'>
                    <h2 className='capitalize text-center font-necoMedium text-xl text-[#F5ECE3] drop-shadow-lg animate-fadeIn'>
                        Citation du jour: "{citationActuelle}"
                    </h2>
                    <div className='flex-1'>
                        <Calendar />
                    </div>                
                </div>

                <div className='hidden xl:block h-full overflow-auto'>
                    <InfoCards />
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
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


    )
}

export default HomePage