import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const Verify = () => {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-x-auto mx-auto">
            <div className="flex flex-col justify-between w-full max-w-[700px] mx-auto px-16 lg:px-6 py-16 ">

                <div className="text-start mb-8 ">
                    <h1 className="font-larken text-xl lg:text-3xl capitalize ">S'identifier</h1>
                </div>

                <form className="mx-auto w-full relative -top-5 flex flex-col justify-center items-center gap-4 ">
                    <div className="mb-7">
                        <h2 className="font-eirene text-xl">Veuillez vous identifer</h2>
                    </div>

                    <div className="font-kollektif flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="matricule" className="mb-1 text-sm text-gray-700">Matricule</label>
                            <AuthInput
                                id="matricule"
                                label="Matricule"
                                placeholder="Entrez votre Matricule"
                                required={true}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="verificationCode" className="mb-1 text-sm text-gray-700">Code de Vérification</label>
                            <AuthInput
                                id="verificationCode"
                                label="Code"
                                placeholder="Entrez votre code "
                            />
                        </div>
                    </div>
                    <div className="flex items-center col-span-1 mx-6 mt-12  lg:justify-center lg:col-span-2">
                        <DefaultButton
                            bgColor="var(--color-accent)"
                            label="Vérifier"
                        />
                    </div>
                </form>

                <div className="text-start mt-6">
                    <p className="text-sm">
                        Code non reçus ?&nbsp;
                        <Link to="/login"
                         className="underline text-gray-800">
                            Renvoyer un code
                        </Link>
                    </p>
                </div>
            </div>
            
            <div className="hidden lg:block w-full h-full overflow-hidden">
                <img
                    src="/img/Verify_bg.png"
                    alt="Background"
                    className="h-full w-full object-contain"
                />
            </div>
        </section>

    );
}

export default Verify