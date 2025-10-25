import React from "react";
import { useState } from "react";
import { loginUser  } from "../../api/auth";
import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";
import { validateLogin } from "../../utils/validation";

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
      <div className="grid grid-cols-2 h-screen">
        {/* Image Display */}
        <div className="h-screen w-full flex justify-center max-md:hidden">
          <img src="/bg.webp" className="w-auto h-full" />
        </div>

        {/* Formulaire */}
        <div className="flex flex-col justify-between h-auto w-auto mx-auto px-4 py-16">
          <div className="text-start ">
            <h1 className="">Bienvenue dans DFCR!</h1>
          </div>


          <form className="mx-auto mt-8 max-w-md space-y-4" action="#" onSubmit={handleLoginSubmit}>

            <div className="mb-7">
              <h2>Connectez vous</h2>
            </div>

            <div>
              <div>
                <label htmlFor="matricule">Matricule</label>
                <AuthInput
                  id="matricule"
                  label="Matricule"
                  placeholder="Entrez votre matricule"
                  value={matricule}
                  required={true}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="motDePasse">Mot de Passe</label>
                <AuthInput
                  id="password"
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  type="password"
                  value={password}
                  required= {true}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className=" ml-10">
              <p className="text-sm">
                <Checkbox />
                Se souvenir de moi
              </p> 
              <div className="flex items-center justify-center">
                <DefaultButton
                  bgColor="var(--color-primary)"
                  text="var(--color-primary-foreground)"
                  label={loading ? "Connexion..." : "Connexion"}
                  type="submit"
                  disabled={loading}
                /> 
              </div>
              <div className="w-full text-center ml-25 mb-12 ">
                <a href="#" className="text-sm underline">
                  Mot de passe oublié
                </a>
              </div>
            </div>

          </form>

          <div className="text-start">
            <p className="text-sm">
              Pas de compte ?&nbsp;
              <a href="#" className="underline">
                Inscrivez vous
              </a>
            </p>
          </div>

        </div>
      </div>
      
    </>
  );
};

export default Login;
