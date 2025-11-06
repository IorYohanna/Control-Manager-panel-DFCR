import { useEffect, useState } from "react";
import { User, Mail, Phone, Lock, UserCircle2, LetterText, User2, Edit } from "lucide-react";
import { Email, EmailOutlined, Public } from "@mui/icons-material";

export default function UserSettings() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8080/current-user/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setForm({
                        firstName: data.username,
                        lastName: data.surname,
                        email: data.email,
                        phoneNumber: data.contact || "",
                    });

                    if (data.service) {
                        setService({
                            serviceName: data.service.serviceName,
                            serviceEmail: data.service.serviceEmail,
                            idService: data.service.idService,
                        });
                    }
                }

            } catch (err) {
                console.error("Erreur lors du chargement du profil :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

     let handleEdit = () => {

     }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-[#2D466E]">
                Chargement du profil...
            </div>
        );
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
                <div className="flex flex-rows gap-6 items-center mb-6" >
                    <UserCircle2 className="w-20 h-20" />
                    <h2 className="text-2xl font-bold text-[#2D466E]">
                        Paramètres du Profil Utilisateur
                    </h2>
                </div>

                <div className="space-y-5 flex flex-col border border-none rounded-2xl bg-gray-50 p-4 ">
                    <button className=" flex gap-1 cursor-pointer" onClick={handleEdit}>
                        <Edit />
                        Modifier
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <UserInfo
                            label="Prénom"
                            icon={<User2 className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.lastName}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                        <UserInfo
                            label="Nom"
                            icon={<User2 className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.firstName}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                        <UserInfo
                            label="Email"
                            icon={<EmailOutlined className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.email}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                        <UserInfo
                            label="telephone"
                            icon={<Phone className="w-5 h-5 text-[#73839E] mr-2" />}
                            value={form.phoneNumber}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-[#2D466E] mb-2 font-necoMedium text-xl">Votre service</h3>
                    <div className="ml-5 space-y-0.5" >
                        <p className="font-dropline" ><span className="font-stardom font-bold text-lg">Nom :</span> {service.serviceName}</p>
                        <p className="font-dropline"><span className="font-stardom font-bold text-lg">Sigle :</span> {service.idService}</p>
                        <p className="font-dropline"><span className="font-stardom font-bold text-lg">Email :</span> {service.serviceEmail}</p>
                    </div>

                </div>

                <div className="mt-10 border-t pt-6">
                    <h3 className="text-lg font-semibold text-[#2D466E] mb-4">
                        Sécurité
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center gap-2 text-[#73839E]">
                            <Lock className="w-5 h-5" />
                            <p>Changer le mot de passe</p>
                        </div>
                        <button className="bg-[#73839E] text-white px-6 py-2 rounded-lg hover:bg-[#5a729b] mt-3 sm:mt-0">
                            Modifier le mot de passe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function UserInfo({ label, icon, value, onChange, disabled }) {
    return (
        <div>
            <label className="text-lg font-dropline text-[#2D466E]">
                {label}
            </label>
            <div className="flex items-center border-dark-blue border-2 rounded-md px-3 py-2 bg-gray-50 mt-1">
                {icon}
                <input
                    type="text"
                    name="phoneNumber"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full bg-transparent text-md font-eirene outline-none text-[#2D466E]"
                />
            </div>
        </div>
    )
}