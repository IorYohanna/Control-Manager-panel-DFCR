import { Calendar, Clock, Users, TrendingUp } from "lucide-react";

export default function InfoCards() {
    const cards = [
        {
            id: 1,
            icon: <Calendar className="w-6 h-6" />,
            title: "Événements à venir",
            value: "12",
            subtitle: "Cette semaine",
            color: "from-[#2D466E] to-[#24344D]"
        },
        {
            id: 2,
            icon: <Clock className="w-6 h-6" />,
            title: "Heures planifiées",
            value: "24h",
            subtitle: "Ce mois",
            color: "from-[#73839E] to-[#2D466E]"
        },
        {
            id: 3,
            icon: <Users className="w-6 h-6" />,
            title: "Participants",
            value: "48",
            subtitle: "Total",
            color: "from-[#5a729b] to-[#73839E]"
        }

    ];

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="grid grid-cols-1 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`
              bg-linear-to-br ${card.color}
              text-center
              rounded-2xl p-6 shadow-lg
              hover:shadow-xl
              cursor-pointer
            `}
                    >
                        <div className="flex items-start justify-center mb-4">
                            <div className="rounded-lg backdrop-blur-sm" style={{ color: "white" }}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="text-white">
                            <h3 className="text-sm font-medium opacity-90 mb-2">
                                {card.title}
                            </h3>
                            <p className="text-3xl font-bold mb-1">
                                {card.value}
                            </p>
                            <p className="text-xs opacity-75">
                                {card.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className=" bg-[#F5ECE3] rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-[#2D466E] mb-3 text-center">
                    Prochaine réunion
                </h3>
                <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#73839E]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Demain, 10:00</span>
                    </div>
                    <p className="text-sm text-[#2D466E] font-medium">
                        Réunion d'équipe mensuelle
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <Users className="w-4 h-4 text-[#73839E]" />
                        <span className="text-xs text-[#73839E]">8 participants</span>
                    </div>
                </div>
            </div>
        </div>
    );
}