import { useEffect, useState } from "react";
import { UserCircle2, Edit, Phone, User2, UserCircle } from "lucide-react";
import { EmailOutlined, Upload } from "@mui/icons-material";
import { extractServiceData, fetchCompleteUserProfile, formatUserFormData, uploadPhoto } from "../../api/User/profileinfo";


export default function UserSettings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
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


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        const formData = new FormData();
        formData.append("file", selectedFile);

        const data = await uploadPhoto(user.matricule, formData)
        return data;

    }


    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Chargement...</div>;
    }

    if (!user) {
        return (
            <div className="text-center text-red-600 mt-10">
                Impossible de charger les informations utilisateur.
            </div>
        );
    }

    return (
        <div className="p-7 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt=""
                                className="w-32 h-32 rounded-full object-cover border-4 border-[#2D466E]"
                            />
                        ) : ""
                        }
                        <label
                            htmlFor="photoInput"
                            className="absolute bottom-0 right-0 bg-[#2D466E] text-white p-2 rounded-full cursor-pointer hover:bg-[#1e2e4b]"
                        >
                            <Upload className="w-5 h-5" />
                        </label>
                        <input
                            type="file"
                            id="photoInput"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {selectedFile && (
                        <button
                            onClick={handleUpload}
                            className="mt-3 bg-[#2D466E] text-white px-4 py-2 rounded-lg hover:bg-[#1e2e4b]"
                        >
                            Enregistrer la photo
                        </button>
                    )}
                </div>

                <div className="space-y-5 flex flex-col border border-none rounded-2xl bg-gray-50 p-4 ">
                    <button className="flex gap-1 cursor-pointer self-end">
                        <Edit />
                        Modifier
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <UserInfo
                            label="Prénom"
                            icon={<User2 className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.lastName}
                            onChange={handleChange}
                        />

                        <UserInfo
                            label="Nom"
                            icon={<User2 className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.firstName}
                            onChange={handleChange}
                        />

                        <UserInfo
                            label="Email"
                            icon={<EmailOutlined className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.email}
                            onChange={handleChange}
                        />

                        <UserInfo
                            label="Téléphone"
                            icon={<Phone className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {service && (
                    <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-[#2D466E] mb-2 text-xl">Votre service</h3>
                        <div className="ml-5 space-y-0.5">
                            <p><span className="font-bold text-lg">Nom :</span> {service.serviceName}</p>
                            <p><span className="font-bold text-lg">Sigle :</span> {service.idService}</p>
                            <p><span className="font-bold text-lg">Email :</span> {service.serviceEmail}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function UserInfo({ label, icon, value, onChange, disabled }) {
    return (
        <div>
            <label className="text-lg text-[#2D466E]">
                {label}
            </label>
            <div className="flex items-center border-dark-blue border-2 rounded-md px-3 py-2 bg-gray-50 mt-1">
                {icon}
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full bg-transparent text-md outline-none text-[#2D466E]"
                />
            </div>
        </div>
    );
}
