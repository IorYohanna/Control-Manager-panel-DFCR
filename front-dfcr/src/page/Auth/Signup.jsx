import React from "react";
import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const options = ['SAGA', 'SG', 'SF', 'SFPR', 'SCRI'];

const Signup = () => {
    return (
        <>
            <section className="grid grid-cols-2 h-screen ">

                <div className="h-auto w-auto overflow-hidden">
                    <img src="/img/bg-left.png" alt="Background" className="max-h-screen w-auto object-contain"/>
                </div>

                <div className="flex flex-col justify-between max-auto mx-15 px-4 py-16">
                    <div className="text-start ">
                        <h1 className="font-black ">Bienvenue dans DFCR!</h1>
                    </div>


                    <form action="" className="mx-auto">

                        <div className="mb-7 font-eirene-regular ">
                            <h2>Veillez Vous Inscrire</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-700" >Nom</label>
                                <AuthInput
                                    id="username"
                                    label="Nom"
                                    placeholder="Entrez votre nom"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-700">Prénom</label>
                                <AuthInput
                                    id="surname"
                                    label="Surname"
                                    placeholder="Entrez votre prénom"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-700">Email</label>
                                <AuthInput
                                    id="email"
                                    label="Email"
                                    placeholder="Entrez votre email"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-700">Fonction</label>
                                <AuthInput
                                    id="fonction"
                                    label="Fonction"
                                    placeholder="Entrez votre fonction"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-700">Mot De Passe</label>
                                <AuthInput
                                    id="password"
                                    label="Mot de passe"
                                    placeholder="Entrez votre mot de passe"
                                    type="password"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm text-gray-700">Service</label>
                                    <Autocomplete
                                        disablePortal
                                        options={options}
                                        renderInput={(params) => <TextField {...params} placeholder="Service" />}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 text-sm text-gray-700">Pefa</label>
                                    <Autocomplete
                                        disablePortal
                                        options={options}
                                        renderInput={(params) => <TextField {...params} placeholder="IdPefa" />}
                                    />
                                </div>

                            </div>


                            <div className="flex items-center justify-center col-span-2 mt-4">
                                <DefaultButton
                                    bgColor="var(--color-primary)"
                                    label="Connexion"
                                />
                            </div>
                        </div>

                    </form>


                    <div className="text-start">
                        <p className="text-sm">
                            Déjà un compte ?&nbsp;
                            <a href="#" className="underline">
                                Connectez-vous
                            </a>
                        </p>
                    </div>

                </div>
            </section>

        </>
    );
};

export default Signup;
