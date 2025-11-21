import { Calendar, FileText, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DossierCard = ({ dossier }) => {
    const navigate = useNavigate();

    const handleDossierClick = () => {
        navigate(`/home/dossiers/${dossier.idDossier}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div
            onClick={handleDossierClick}
            className="bg-white rounded-xl p-4 shadow-sm border-2 border-[#c4beaf]/20 hover:border-[#2d466e]/30 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="bg-linear-to-br from-[#73839e] to-[#2d466e] p-4 rounded-xl flex items-center justify-center">
                    <Folder size={32} className="text-white" />
                </div>

                <div className="flex-1 capitalize">
                    <h3 className="text-sm sm:text-lg font-necoMedium font-bold text-[#24344d] mb-2 group-hover:text-[#2d466e] transition-colors truncate">
                        {dossier.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs mt-4 text-[#73839e]">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(dossier.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText size={14} />
                            <span>{dossier.documentCount || 0} documents</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
