import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchServiceData } from "../../../api/User/currentUser";

export default function InfoCards() {
    const [serviceData, setServiceData] = useState({
        userCount: 0,
        eventCount: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchServiceData();
                setServiceData({
                    userCount: data.userCount,
                    eventCount: data.eventCount,
                    idService: data.idService,
                    serviceName: data.serviceName
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p>Chargement...</p>;

    const cards = [
        {
            id: 1,
            icon: <Clock className="w-6 h-6" />,
            title: "Votre Service",
            value: serviceData.idService,
            subtitle: serviceData.serviceName,
            color: "from-[#2D466E] to-[#24344D]"
           
        },
        {
            id: 2,
            icon: <Users className="w-6 h-6" />,
            title: "Utilisateurs",
            value: loading ? "..." : serviceData.userCount,
            subtitle: "Présents",
            color: "from-[#73839E] to-[#2D466E]"
        },
        {
            id: 3,
            icon: <Calendar className="w-6 h-6" />,
            title: "Événements",
            value: loading ? "..." : serviceData.eventCount,
            subtitle: "Ce mois-ci",
             color: "from-[#5a729b] to-[#73839E]"
            
        },


    ];

    return (
        <div className="flex flex-col gap-4 overflow-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-[#73839e]/10">
                <h2 className="text-lg font-necoBlack font-bold text-[#2d466e] text-center">
                Statistiques
                </h2>
                <p className="text-sm text-[#73839e] text-center mt-1">
                {serviceData.serviceName}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`
              bg-linear-to-br ${card.color}
              rounded-2xl p-6 shadow-lg
              transform transition-all duration-300
              hover:shadow-xl text-center
              cursor-pointer
            `}
                    >
                        <div className="flex items-start justify-center mb-4">
                            <div className="p-3 rounded-lg backdrop-blur-sm" style={{ color: "white" }}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="text-white">
                            <h3 className="text-sm font-necoMedium uppercase font-medium opacity-90 mb-2">
                                {card.title}
                            </h3>
                            <p className="text-3xl font-eirene font-bold mb-1">
                                {card.value}
                            </p>
                            <p className="text-sm font-stardom opacity-75">
                                {card.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#F5ECE3] rounded-2xl p-6 shadow-md text-center">
                <h3 className="text-lg font-bold text-[#2D466E] mb-3">
                    Prochaine réunion
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-[#73839E]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Demain, 10:00</span>
                    </div>
                    <p className="text-sm text-[#2D466E] font-medium">
                        Réunion d'équipe mensuelle
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <Users className="w-4 h-4 text-[#73839E]" />
                        <span className="text-xs text-[#73839E]">
                            {serviceData.userCount} participants potentiels
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}