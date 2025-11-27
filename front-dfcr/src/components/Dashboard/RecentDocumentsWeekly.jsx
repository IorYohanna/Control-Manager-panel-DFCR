import React, { useState, useEffect } from 'react';
import { FileText, Calendar, SearchX, CheckCircle2, File } from 'lucide-react';

export function RecentDocumentsWeekly({ documents, loading }) {
    const [groupedDocuments, setGroupedDocuments] = useState([]);

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    useEffect(() => {
        const recentDocs = documents.slice(0, 4);
        const grouped = getDocumentsByWeek(recentDocs);
        setGroupedDocuments(grouped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documents]);

    const getDocumentsByWeek = (docs) => {
        const weeks = {};
        const today = new Date();

        docs.forEach(doc => {
            if (!doc.createdTime) return;

            const docDate = new Date(doc.createdTime);
            const weekLabel = getWeekLabel(docDate, today);

            if (!weeks[weekLabel]) {
                weeks[weekLabel] = {
                    label: weekLabel,
                    startDate: getWeekStart(docDate),
                    documents: []
                };
            }

            weeks[weekLabel].documents.push(doc);
        });

        return Object.values(weeks).sort((a, b) => b.startDate - a.startDate);
    };

    const getWeekStart = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(d.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    };

    const getWeekLabel = (date, today) => {
        const docDate = new Date(date);
        docDate.setHours(0, 0, 0, 0);

        const todayDate = new Date(today);
        todayDate.setHours(0, 0, 0, 0);

        const weekStart = getWeekStart(docDate);
        const todayWeekStart = getWeekStart(todayDate);

        const diffTime = todayWeekStart.getTime() - weekStart.getTime();
        const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));

        if (diffWeeks === 0) return "Cette semaine";
        if (diffWeeks === 1) return "Semaine dernière";
        if (diffWeeks <= 4) return `Il y a ${diffWeeks} semaines`;

        return `${monthNames[docDate.getMonth()]} ${docDate.getFullYear()}`;
    };

    const getWeekDateRange = (weekStart) => {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const formatDate = (d) => {
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            return `${day}/${month}`;
        };

        return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    };

    return (
        <div className="col-span-1 md:col-span-2 h-full flex flex-col relative group">
            <div className="h-full flex flex-col backdrop-blur-xl bg-[#f5ece3]/70 rounded-xl p-6 lg:p-8 shadow-lg border border-white/50 hover:border-white/60 transition-all duration-100 hover:shadow-xl">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl text-[#2d466e] font-bold font-dropline flex items-center gap-2">
                            <File className="w-5 h-5 text-emerald-600" />
                            Documents récents
                        </h3>
                        <p className="text-xs text-[#73839e] font-eirene mt-1">
                            4 derniers documents créés
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col min-h-[200px]">
                    {loading ? (
                        <div className="space-y-3 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-white/30 rounded-lg border border-white/20"></div>
                            ))}
                        </div>
                    ) : groupedDocuments.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                            <div className="w-16 h-16 bg-[#2d466e]/5 rounded-full flex items-center justify-center mb-3">
                                <SearchX className="w-8 h-8 text-[#2d466e]" />
                            </div>
                            <p className="text-[#2d466e] font-medium text-sm">Aucun document trouvé</p>
                            <p className="text-[#73839e] text-xs">Les documents créés apparaîtront ici</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-[#2d466e]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#2d466e]/20">
                            {groupedDocuments.map((week, weekIndex) => (
                                <div key={weekIndex} className="space-y-2">
                                    <div className="flex items-center gap-3 px-2 sticky top-0 bg-[#f5ece3]/90 backdrop-blur-sm py-2 rounded-lg z-10">
                                        <Calendar size={16} className="text-[#73839e]" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-[#2d466e]">
                                                {week.label}
                                            </h4>
                                            <p className="text-[10px] text-[#73839e]">
                                                {getWeekDateRange(week.startDate)}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/60 text-[#2d466e] border border-[#2d466e]/10">
                                            {week.documents.length} doc{week.documents.length > 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {week.documents.map((doc, index) => (
                                            <div
                                                key={index}
                                                className="group/card relative bg-white/40 hover:bg-white/80 rounded-lg p-3 border border-white/40 hover:border-white/80 transition-all duration-200 hover:shadow-sm"
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex items-start gap-2.5 overflow-hidden flex-1">
                                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2d466e] shadow-sm shrink-0">
                                                            <FileText className="w-4 h-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-[#2d466e] font-bold text-sm truncate pr-2 leading-tight">
                                                                {doc.reference || "Sans référence"}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                                <span className="text-[10px] font-bold bg-[#2d466e]/5 text-[#2d466e] px-2 py-0.5 rounded-md border border-[#2d466e]/10">
                                                                    {doc.type || "Document"}
                                                                </span>
                                                                <span className="text-[11px] text-[#73839e] truncate">
                                                                    par {doc.creatorName?.split(' ')[0] || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end shrink-0">
                                                        <p className="text-[10px] font-bold text-[#73839e] uppercase bg-white/50 px-2 py-1 rounded-lg">
                                                            {new Date(doc.createdTime).toLocaleDateString("fr-FR", {
                                                                day: "2-digit",
                                                                month: "short",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}