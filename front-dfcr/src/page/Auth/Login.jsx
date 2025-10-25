import React from "react";
import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";

const Login = () => {
  return (
    <>
      <div className="grid grid-cols-2 h-screen ">

        <div className="relative bg-antique-white-image w-full h-auto bg-cover bg-center">
          <div className="absolute inset-0 bg-[var(--color-background)] opacity-100 mix-blend-multiply"></div>
        </div>

        <div className="flex flex-col justify-between max-auto mx-15 px-4 py-16">
          <div className="text-start ">
            <h1 className="">Bienvenue dans DFCR!</h1>
          </div>


          <form className="mx-auto mt-8 max-w-md space-y-4" action="#">

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
                />
              </div>
              <div>
                <label htmlFor="motDePasse">Mot de Passe</label>
                <AuthInput
                  id="password"
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  type="password"
                />
              </div>
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
                  label="Connexion"
                /> 
              </div>
              <div className="w-full text-center ml-25 ">
                <a href="#" className="text-sm underline">
                  Mot de passe oublié
                </a>
              </div>
            </div>

            <div className="h-[3rem]"/>
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
