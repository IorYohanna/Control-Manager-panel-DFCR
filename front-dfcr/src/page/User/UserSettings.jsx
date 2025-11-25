import { useEffect, useState } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { Score, Subject, Update, Upload, Warning } from "@mui/icons-material";
import {
    deleteUser,
    extractServiceData,
    fetchCompleteUserProfile,
    formatUserFormData,
    uploadPhoto
} from "../../api/User/profileinfo";
import { ActionCard, InfoRow } from "../../components/ui/cards/UserSettingsCards";

export default function UserSettings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [form, setForm] = useState({
        matricule: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        fonction: "",
        score : "",
        evaluation: "",
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const { userData, photoUrl } = await fetchCompleteUserProfile();

                setUser(userData);
                setForm(formatUserFormData(userData));
                setService(extractServiceData(userData));

                if (photoUrl) {
                    setPreviewUrl(photoUrl);
                }
            } catch (err) {
                console.error("Erreur lors du chargement du profil :", err);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        const formData = new FormData();
        formData.append("file", selectedFile);
        await uploadPhoto(user.matricule, formData);
    };

    if (loading) {
        return (
            <div className="w-full m-6 flex items-center justify-center bg-linear-to-br from-light-blue to-blue-zodiac">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full m-6 flex items-center justify-center bg-linear-to-br from-light-blue to-blue-zodiac">
                <div className="text-white text-xl flex flex-col items-center justify-center gap-4">
                    <Warning sx={{width: "50px", height: "50px"}}/>
                    Impossible de charger les informations utilisateur.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-linear-to-br p-4 flex items-center justify-center overflow-auto thin-scrollbar">
            <div className="w-full h-full">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="relative h-30 bg-linear-to-r from-light-blue via-blue-zodiac to-dark-blue" />

                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="relative inline-block">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-xl flex items-center justify-center">
                                        <span className="text-4xl text-gray-500">👤</span>
                                    </div>
                                )}
                                <label
                                    htmlFor="photoInput"
                                    className="absolute bottom-0 right-0 bg-white-gray text-white p-2 rounded-full cursor-pointer hover:bg-gray-500 transition-colors shadow-lg"
                                >
                                    <Upload className="w-4 h-4" />
                                </label>
                                <input
                                    type="file"
                                    id="photoInput"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 capitalize">
                                    {form.firstName} {form.lastName}
                                </h1>
                                <p className="text-gray-600 mb-2 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    {form.fonction || " Votre poste"}
                                </p>
                                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {service?.serviceName || "Votre Adresse"}
                                </p>

                                <div className="flex gap-3 mb-8">
                                    <button className=" bg-gray-900 text-white py-2.5 px-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                                        Modifier Profile
                                    </button>
                                    <button onClick={deleteUser} className=" bg-red-700 text-white py-2.5 px-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                                        Supprimer Profile
                                    </button>
                                    {selectedFile && (
                                        <button
                                            onClick={handleUpload}
                                            className=" bg-gray-900 text-white py-2.5 px-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                                        >
                                            Enregistrer la photo
                                        </button>
                                    )}

                                </div>

                                <div className="space-y-3">
                                    <ActionCard
                                        title="PEFA | score"
                                        description={form.score}
                                        icon={<Score/>}
                                    />
                                    <ActionCard
                                        title="PEFA | Sujet Evaluation"
                                        description={form.evaluation}
                                        icon={<Subject/>}
                                    />
                                    <ActionCard
                                        title="Mise à jour"
                                        description="N'éviter pas à mettre à jour votre profil | Photo de Profil"
                                        icon={<Update/>}
                                    />
                                </div>

                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            Poste Occupé
                                        </h3>
                                    </div>
                                    <p className="text-xl uppercase font-semibold text-gray-900">
                                        {form.fonction || "Votre Poste"}
                                    </p>
                                </div>


                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                                        Contact
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoRow label="Matricule" value={form.matricule} />
                                        <InfoRow label="Email" value={form.email} />
                                        <InfoRow label="Téléphone" value={form.phoneNumber} />
                                    </div>
                                </div>

                                {service && (
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-necoBlack font-semibold text-gray-500 uppercase mb-4">
                                            détails service
                                        </h3>
                                        <div className="space-y-3">
                                            <InfoRow label="Service" value={service.serviceName} />
                                            <InfoRow label="Sigle" value={service.idService} />
                                            <InfoRow label="Email" value={service.serviceEmail} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

