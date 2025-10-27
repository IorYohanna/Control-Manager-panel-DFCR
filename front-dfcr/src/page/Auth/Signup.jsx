import { useState } from "react";
import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signupUser  } from "../../api/auth";

const options = ['SAGA', 'SG', 'SF', 'SFPR', 'SCRI', 'SPSE'];

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

        try{
            const data = await signupUser(matricule,username,surname,password,email,fonction,contact,idService)
            console.log("Connexion réussi :", data)
            Navigate("/verify")
        } catch (err) {
            console.log("Erreur d'authentification :" , err.message)
            setError(err.message)
        } finally {
            setLoading(false)
        }

    }
    
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-x-auto mx-auto">

            <div className="hidden lg:block w-full h-full overflow-hidden">
                <img
                    src="/img/bg-left.png"
                    alt="Background"
                    className="h-full w-full object-contain"
                />
            </div>

            <div className="flex flex-col justify-between w-full max-w-[700px] mx-auto px-16 lg:px-6 py-16 ">

                <div className="text-start mb-8 ">
                    <h1 className="font-larken text-xl lg:text-3xl capitalize ">Inscrivez-vous des maintenant</h1>
                </div>

                <form className="mx-auto w-full relative -top-5" action="#" onSubmit={handleSignupSubmit}>
                    <div className="mb-7">
                        <h2 className="font-eirene text-xl">Veuillez vous inscrire</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-kollektif">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 text-sm text-gray-700">Matricule</label>
                            <AuthInput
                                id="matricule"
                                label="Matricule"
                                placeholder="Entrez votre matricule"
                                value={matricule}
                                required={true}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 text-sm text-gray-700">Nom</label>
                            <AuthInput
                                id="username"
                                label="Nom"
                                placeholder="Entrez votre nom"
                                value={username}
                                required={true}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="surname" className="mb-1 text-sm text-gray-700">Prénom</label>
                            <AuthInput
                                id="surname"
                                label="Prénom"
                                placeholder="Entrez votre prénom"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-1 text-sm text-gray-700">Mot de passe</label>
                            <AuthInput
                                id="password"
                                label="Mot de passe"
                                placeholder="Entrez votre mot de passe"
                                type="password"
                                value={password}
                                required={true}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-sm text-gray-700">Email</label>
                            <AuthInput
                                id="email"
                                label="Email"
                                placeholder="Entrez votre email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="fonction" className="mb-1 text-sm text-gray-700">Fonction</label>
                            <AuthInput
                                id="fonction"
                                label="Fonction"
                                placeholder="Entrez votre fonction"
                                value={fonction}
                                required={true}
                                onChange={(e) => setFonction(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="contact" className="mb-1 text-sm text-gray-700">Contact</label>
                            <AuthInput
                                id="contact"
                                label="contact"
                                placeholder="Entrez votre contact"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-[300px] ">
                            <label htmlFor="service" className="mb-1 text-sm text-gray-700">Service</label>
                            <Autocomplete
                                sx={
                                    {
                                        width: "auto"
                                    }
                                }
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
                            bgColor="var(--color-accent)"
                            label={loading ? "S'inscrire..." : "S'inscrire"}
                            type="submit"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                </form>

                <div className="text-start mt-6">
                    <p className="text-sm">
                        Déjà un compte ?&nbsp;
                        <Link to="/login" className="underline text-gray-800">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </section>

    );
};

export default Signup;
