import { useState } from "react";
import Input from "../../components/input/Input";
import DefaultButton from "../../components/Button/DefaultButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/Auth/auth";

const options = ['SAGA', 'SG', 'SF', 'SRFP', 'SCRI', 'SPSE', 'ORDSEC', 'SP', 'Chargé de Mission', 'Coordinateur des activités'];
const fonctions = ['Directeur', 'Chef de service', 'Employé']

const Signup = () => {
    const [username, setUsername] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [fonction, setFonction] = useState("")
    const [password, setPassword] = useState("")
    const [idService, setIdService] = useState("")
    const [matricule, setMatricule] = useState("")
    const [contact, setContact] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const Navigate = useNavigate()

    const handleSignupSubmit = async (e) => {
        e.preventDefault()
        setError(null)


        setLoading(true)

        try {
            const data = await signupUser(matricule, username, surname, password, email, fonction, contact, idService)
            console.log("Connexion réussi :", data)
            localStorage.setItem("email", email)
            Navigate("/verify")
        } catch (err) {
            console.log("Erreur d'inscription :", err.message);
            setError(err.message)
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <section className="bg-beige-creme grid grid-cols-1 lg:grid-cols-12 h-screen overflow-x-auto mx-auto">

            <div className="hidden lg:block col-span-5 w-full h-full overflow-hidden bg-beige-creme">
                <img
                    src="/img/signup.png"
                    alt="Background"
                    className="h-full w-full object-cover  "
                />
            </div>

            <div className="flex flex-col justify-between col-span-7 w-full max-w-[700px] mx-auto px-16 lg:px-6 py-10 ">

                <div className="text-start mb-12">
                    <h1 className="font-necoMedium text-xl lg:text-3xl capitalize ">Inscrivez-vous des maintenant</h1>
                </div>

                <form className="mx-auto w-full relative -top-5" action="#" onSubmit={handleSignupSubmit}>
                    <div className="mb-7">
                        <h2 className="font-stardom font-bold text-xl">Veuillez vous inscrire</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-dropline">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 text-sm text-gray-700">Matricule</label>
                            <Input
                                id="matricule"
                                label="Matricule"
                                placeholder="Entrez votre matricule"
                                value={matricule}
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                required={true}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 text-sm text-gray-700">Nom</label>
                            <Input
                                id="username"
                                label="Nom"
                                placeholder="Entrez votre nom"
                                value={username}
                                required={true}
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="surname" className="mb-1 text-sm text-gray-700">Prénom</label>
                            <Input
                                id="surname"
                                label="Prénom"
                                placeholder="Entrez votre prénom"
                                value={surname}
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-1 text-sm text-gray-700">Mot de passe</label>
                            <Input
                                id="password"
                                label="Mot de passe"
                                placeholder="Entrez votre mot de passe"
                                type="password"
                                value={password}
                                required={true}
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-sm text-gray-700">Email</label>
                            <Input
                                id="email"
                                label="Email"
                                placeholder="Entrez votre email"
                                value={email}
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="fonction" className="mb-1 text-sm text-gray-700">Fonction</label>
                            <Autocomplete
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                disablePortal
                                options={fonctions}
                                renderInput={(params) => <TextField {...params} placeholder="Fonction" />}
                                value={fonction}
                                onChange={(event, newValue) => setFonction(newValue)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="contact" className="mb-1 text-sm text-gray-700">Contact</label>
                            <Input
                                id="contact"
                                label="Contact"
                                placeholder="Entrez votre contact"
                                value={contact}
                                sx={{ width: "100%", background: "#e0e0e0" }}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-[300px] ">
                            <label htmlFor="service" className="mb-1 text-sm text-gray-700">Service</label>
                            <Autocomplete
                                sx={{ width: "105%", background: "#e0e0e0" }}
                                disablePortal
                                options={options}
                                renderInput={(params) => <TextField {...params} placeholder="Service" />}
                                value={idService}
                                onChange={(event, newValue) => setIdService(newValue)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center col-span-1 mx-6 mt-12  lg:justify-center lg:col-span-2">
                        <DefaultButton
                            text="#24344D"
                            bgColor="#F5ECE3"
                            label={loading ? "S'inscrire..." : "S'inscrire"}
                            type="submit"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-6">
                            {error}
                        </div>
                    )}


                </form>

                <div className="text-start mt-6">
                    <p className="text-sm">
                        Déjà un compte ?&nbsp;
                        <Link to="/login" className="underline font-dropline text-gray-800">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </section>

    );
};

export default Signup;
