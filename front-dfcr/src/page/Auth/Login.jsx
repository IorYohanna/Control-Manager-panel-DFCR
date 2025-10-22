import React from "react";
import AuthInput from "../../components/input/AuthInput";
import DefaultButton from "../../components/DefaultButton";
import Checkbox from "@mui/material/Checkbox";

const Login = () => {
  return (
    <>
      <form class="mx-auto mb-0 mt-8 max-w-md space-y-4" action="#">

        <div>
          <AuthInput
            id="matricule"
            label="Matricule"
            placeholder="Entrez votre matricule"
          />

          <AuthInput
            id="password"
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            type="password"
            sx={{ m: 1, width: "50ch", pb: 10 }}
          />
        </div>


        <div class="flex items-center justify-between">
          <p class="text-sm">
            <Checkbox />
            Remember me
          </p>

          <DefaultButton
            bgColor="var(--color-primary)"
            text="var(--color-primary-foreground)"
            label="Connexion"
          />
        </div>

        <div class="flex items-center justify-between">

          <p class="text-sm text-gray-600">
            Pas de compte ?&nbsp;
            <a href="#" class="underline text-blue-400">
              Inscrivez vous
            </a>
          </p>

          <a href="#" class="text-sm underline text-blue-400">
            Mot de passe oublié
          </a>

        </div>

      </form>
    </>
  );
};

export default Login;
