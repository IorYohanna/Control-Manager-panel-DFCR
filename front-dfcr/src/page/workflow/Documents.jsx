import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button, StatusBadge } from "./Base";

export const DocumentsTable = ({ documents, onSelectDocument, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Chargement...</p>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Aucun document trouvé</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b font-necoMedium border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                <div className="col-span-2">Référence</div>
                <div className="col-span-3">Objet</div>
                <div className="col-span-2">Date de mise à jour</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-3 text-right">Actions</div>
            </div>

            {documents.map((doc) => (
                <div
                    key={doc.reference}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center"
                >
                    <div className="col-span-2 font-medium text-gray-800 text-sm">{doc.reference}</div>
                    <div className="col-span-3 text-gray-600 text-sm truncate">{doc.objet ? doc.objet : "Vide"}</div>
                    <div className="col-span-2 text-gray-600 text-sm">{doc.updateTime || 'N/A'}</div>
                    <div className="col-span-2">
                        <StatusBadge status={doc.status} />
                    </div>
                    <div className="col-span-3 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectDocument(doc, 'view')}
                        >
                            Détails
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectDocument(doc, 'action')}
                        >
                            Actions
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectDocument(doc, 'history')}
                        >
                            Historique
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={18} className="text-gray-600" />
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded-lg font-medium transition-colors text-sm ${currentPage === page
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={18} className="text-gray-600" />
            </button>
        </div>
    );
};