import React from "react";
import AuthInput from "../../components/input/AuthInput";
import AuthButton from "../../components/AuthButton";
import Checkbox from "@mui/material/Checkbox";

const Login = () => {
  return <div>
    {/* Titre */}

    {/* Formulaire */}
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

    {/* Button */}
    <div class="flex items-center justify-between">

      <p class="text-sm">
        <Checkbox></Checkbox>
        Remember me
      </p>

      <AuthButton 
        bgColor="var(--color-primary)"
        text="var(--color-primary-foreground)"
        label = "Connexion"
      /> 
    </div>
  </div>;
};

export default Login;
