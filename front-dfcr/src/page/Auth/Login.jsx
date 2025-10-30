import React from "react";
import { useState } from "react";
import { loginUser  } from "../../api/auth";
import Input from "../../components/input/Input";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";

const validateLogin = ({ matricule, password }) => {
  const errors = {};
  if (!matricule.trim()) errors.matricule = "Le matricule est requis";
  if (!password.trim()) errors.password = "Le mot de passe est requis";
  return errors;
};

const Login = () => {
  const [matricule, setMatricule] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errors = validateLogin({ matricule, password})
    if (Object.keys(errors).length > 0 ) {
      setError(Object.values(errors).join(" / "))
      return;
    }
    setLoading(true);

    try {
      const data = await loginUser(matricule, password);
      console.log("Connexion réussie :", data);
      localStorage.setItem("token", data.token)
      localStorage.setItem("token_expiration", data.expiresIn)
    } catch (err) {
      console.error("Erreur d'authentification: ", err.message)
      // console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 h-screen mx-auto overflow-auto text-primary">
        {/* Image Display */}
        <div className="hidden lg:block w-full h-full overflow-hidden">
                <img
                    src="/img/bg-left.png"
                    alt="Background"
                    className="h-full w-full object-contain"
                />
        </div>
        {/* Formulaire */}
        <div className="flex flex-col justify-between w-full mx-auto max-w-[700px] px-16 lg:px-16 py-16">
          <div className="text-start ">
            <h1 className="font-larken text-xl lg:text-3xl capitalize">Bienvenue dans DFCR!</h1>
          </div>


          <form className="mx-auto max-w-[700px] w-auto relative" action="#" onSubmit={handleLoginSubmit}>

            <div className="mb-7">
              <h2 className="font-eirene text-xl">Connectez vous</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 font-kollektif">
              <div className="flex flex-col">
                <label htmlFor="matricule" className="mb-1 text-sm text-gray-700">Matricule</label>
                <Input
                  id="matricule"
                  label="Matricule"
                  placeholder="Entrez votre matricule"
                  value={matricule}
                  required={true}
                  sx={{ width: "auto"}}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="motDePasse" className="mb-1 text-sm text-gray-700">Mot de Passe</label>
                <Input
                  id="password"
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  type="password"
                  value={password}
                  required= {true}
                  sx={{ width: "auto"}}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="mt-5">
              <p className="text-sm">
                <Checkbox />
                Se souvenir de moi
              </p> 
              <div className="flex items-center col-span-1 mx-6 mt:12">
                <DefaultButton
                  bgColor="var(--color-accent)"
                  label={loading ? "Connexion..." : "Connexion"}
                  type="submit"
                  disabled={loading}
                /> 
              </div>
              <div className="w-full text-center ml-25 mb-12 ">
                <Link to="/verify" className="text-sm underline">
                    Mot de passe oublié
                </Link>
              </div>
            </div>

          </form>

          <div className="text-start">
            <p className="text-sm">
              Pas de compte ?&nbsp;
              <Link to="/"className="underline text-gray-800">
                  Inscrivez vous
              </Link>
            </p>
          </div>

        </div>
      </section>
      
    </>
  );
};

export default Login;
