import { Download, FileText, Loader2, Search, X } from "lucide-react";

// eslint-disable-next-line no-unused-vars
export function DossierStatsCards({ icon: Icon, value, label, color, bgColor }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#c4beaf]/30 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: bgColor }}
                >
                    <Icon size={22} style={{ color }} />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-[#24344d] mb-1">{value}</h3>
            <p className="text-sm text-[#73839e]">{label}</p>
        </div>
    );
}

export function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#73839e]" size={18} />
            <input
                type="text"
                placeholder="Rechercher par référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-[#c4beaf]/50 rounded-lg focus:outline-none focus:border-[#2d466e] bg-white text-[#24344d] placeholder-[#73839e] text-sm"
            />
            {searchQuery && (
                <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#73839e] hover:text-[#24344d]"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}


// eslint-disable-next-line no-unused-vars
export function DocumentTable({ documents, searchQuery, downloadingRef, onDownload, loading }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#c4beaf]/30 overflow-y-auto hide-scrollbar max-h-[400px]">
            <table className="min-w-[600px] sm:min-w-full w-full">
                <thead className="bg-[#f5ece3]/40 border-b border-[#c4beaf]/30">
                    <tr>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-[#73839e] uppercase tracking-wider">Reference</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-[#73839e] uppercase tracking-wider">Créé le</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-[#73839e] uppercase tracking-wider">Modifié le</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-[#73839e] uppercase tracking-wider">Créateur</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-[#73839e] uppercase tracking-wider">Type</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-[#73839e] uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.length > 0 ? (
                        documents.map((doc, index) => (
                            <tr
                                key={doc.reference}
                                className={`border-b border-[#c4beaf]/20 hover:bg-[#f5ece3]/30 transition-colors ${index === documents.length - 1 ? 'border-b-0' : ''
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <span className="text-sm font-semibold text-[#2d466e]">
                                        {doc.reference}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-[#24344d] font-medium">
                                            {doc.createdTime ? new Date(doc.createdTime).toLocaleString() : 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-[#24344d] font-medium">
                                            {doc.updatedTime ? new Date(doc.updatedTime).toLocaleString() : 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-[#2d466e]">
                                        N° {doc.creatorName}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#f5ece3] text-[#2d466e]">
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => onDownload(doc.reference, e)}
                                            disabled={downloadingRef === doc.reference}
                                            className="px-2.5 py-2 hover:bg-[#f5ece3] rounded-lg transition-colors disabled:opacity-50"
                                            title="Télécharger"
                                        >
                                            {downloadingRef === doc.reference ? (
                                                <Loader2 size={18} className="animate-spin text-[#2d466e]" />
                                            ) : (
                                                <Download size={18} className="text-[#73839e] hover:text-[#2d466e]" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="bg-[#f5ece3] w-16 h-16 rounded-full flex items-center justify-center">
                                        <FileText className="text-[#73839e]" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#24344d] mb-1">
                                            {searchQuery ? "Aucun Résultats" : "Aucun documents"}
                                        </h3>
                                        <p className="text-sm text-[#73839e]">
                                            {searchQuery
                                                ? "Essayer une autre reference"
                                                : "Commencez par ajouter des documents au dossier."}
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {documents.length > 0 && (
                <div className="px-6 py-3 border-t border-[#c4beaf]/30 bg-[#f5ece3]/20">
                    <span className="text-sm text-[#73839e]">
                        {documents.length} document{documents.length > 1 ? 's' : ''}
                    </span>
                </div>
            )}
        </div>
    );
}