
export function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
            <span className="text-sm font-dropline font-medium text-gray-600">{label}</span>
            <span className="text-sm text-gray-900 font-eirene">{value || "—"}</span>
        </div>
    );
}

export function ActionCard({ title, description, icon }) {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-light-blue transition-colors cursor-pointer group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{icon}</span>
                        <h4 className="font-semibold text-gray-900">{title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
}