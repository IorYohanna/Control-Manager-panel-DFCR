import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const options = ['SAGA', 'SG', 'SF', 'SFPR', 'SCRI'];

const Signup = () => {
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

                <form className="mx-auto w-full relative -top-5">
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
                                required={true}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 text-sm text-gray-700">Nom</label>
                            <AuthInput
                                id="username"
                                label="Nom"
                                placeholder="Entrez votre nom"
                                required={true}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="surname" className="mb-1 text-sm text-gray-700">Prénom</label>
                            <AuthInput
                                id="surname"
                                label="Prénom"
                                placeholder="Entrez votre prénom"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-sm text-gray-700">Email</label>
                            <AuthInput
                                id="email"
                                label="Email"
                                placeholder="Entrez votre email"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="fonction" className="mb-1 text-sm text-gray-700">Fonction</label>
                            <AuthInput
                                id="fonction"
                                label="Fonction"
                                placeholder="Entrez votre fonction"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-1 text-sm text-gray-700">Mot de passe</label>
                            <AuthInput
                                id="password"
                                label="Mot de passe"
                                placeholder="Entrez votre mot de passe"
                                type="password"
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
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Service" />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex items-center col-span-1 mx-6 mt-12  lg:justify-center lg:col-span-2">
                        <DefaultButton
                            bgColor="var(--color-accent)"
                            label="Connexion"
                        />
                    </div>
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
