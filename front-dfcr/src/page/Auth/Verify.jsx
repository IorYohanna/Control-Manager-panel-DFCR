import Input from "../../components/input/Input";
import DefaultButton from "../../components/DefaultButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resendCode, VerifyUser } from "../../api/auth";

const validateVerify = ({ matricule, verificationCode }) => {
    const errors = {};
    if (!matricule.trim()) errors.matricule = "Le matricule est requis";
    if (!verificationCode.trim()) errors.verificationCode = "Le code est requis";
    return errors;
};

const Verify = () => {

    const [matricule, setMatricule] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState();

    const Navigate = useNavigate();

    const savedEmail = localStorage.getItem("email");

    const handleResendCode = async () => {
        if (!savedEmail) {
            setError("Email non trouvé par le code")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await resendCode(savedEmail);
            console.log("Email envoyé avec succès !");
            alert("Le code de vérification a été renvoyé !");
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }


    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const errors = validateVerify({ matricule, verificationCode })
        if (Object.keys(errors).length > 0) {
            setError(Object.values(errors).join(" / "))
            return;
        }
        setLoading(true);

        try {
            const data = await VerifyUser(matricule, verificationCode);
            console.log(" Verification Réussie :", data);
            Navigate("/login")
        } catch (err) {
            console.error("Erreur de verfication : ", err.message)
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-x-auto mx-auto">
            <div className="flex flex-col justify-between w-full max-w-[700px] mx-auto px-16 lg:px-6 py-16 ">

                <div className="text-start mb-8 ">
                    <h1 className="font-larken text-xl lg:text-3xl capitalize ">S'identifier</h1>
                </div>

                <form className="mx-auto w-full relative -top-5 flex flex-col justify-center items-center gap-4 " onSubmit={handleVerifySubmit}
                >
                    <div className="mb-7">
                        <h2 className="font-eirene text-xl">Veuillez vous identifer</h2>
                    </div>

                    <div className="font-kollektif flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="matricule" className="mb-1 text-sm text-gray-700">Matricule</label>
                            <Input
                                id="matricule"
                                label="Matricule"
                                placeholder="Entrez votre Matricule"
                                required={true}
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="verificationCode" className="mb-1 text-sm text-gray-700">Code de Vérification</label>
                            <Input
                                id="verificationCode"
                                label="Code"
                                placeholder="Entrez votre code "
                                required={true}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center col-span-1 mx-6 mt-12  lg:justify-center lg:col-span-2">
                        <DefaultButton
                            bgColor="var(--color-accent)"
                            label={loading ? "Verification..." : "Verifier"}
                            type="submit"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                </form>

                <div className="text-start mt-6">
                    <p className="text-sm">
                        Code non reçus ?&nbsp;
                        <Link
                            to="#"
                            className="underline text-gray-800"
                            onClick={handleResendCode}
                        >
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