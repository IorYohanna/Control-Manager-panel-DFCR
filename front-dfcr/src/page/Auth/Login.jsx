import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { loginUser } from "../../api/Auth/auth";
import Input from "../../components/input/Input";
import DefaultButton from "../../components/Button/DefaultButton";
import CurvedLoop from "../../components/ui/CurvedLoop";

const validateLogin = ({ matricule, password }) => {
  const errors = {};
  if (!matricule.trim()) errors.matricule = "Le matricule est requis";
  if (!password.trim()) errors.password = "Le mot de passe est requis";
  return errors;
};

const Login = () => {
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errors = validateLogin({ matricule, password });
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(" / "));
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(matricule, password);
      console.log("Connexion réussie :", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("token_expiration", data.expiresIn);

      navigate("/home");
    } catch (err) {
      console.error("Erreur d'authentification: ", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <div className="w-full h-10 shrink-0 z-10 relative">
        <CurvedLoop
          marqueeText=" • DFCR • BIENVENUE • Direction des Formations et Coordinations des Reformes  "
          speed={1.5}
          curveAmount={0}
          direction="left"
          className="text-lg text-blue-50 "
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 flex-1 mx-auto overflow-auto text-primary z-0">
        <div className="hidden lg:block col-span-5 w-full h-full overflow-hidden bg-beige-creme">
          <img
            src="/img/bg.png"
            alt="Background"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-between col-span-7 w-full mx-auto max-w-[700px] px-8 lg:px-16 py-16">
          <div className="text-start">
            <h1 className="font-necoMedium font-ligh text-3xl lg:text-5xl capitalize text-[#223148]">
              Bienvenue dans DFCR!
            </h1>
          </div>

          <form
            className="mx-auto max-w-[700px] w-full"
            onSubmit={handleLoginSubmit}
          >
            <div className="mb-8">
              <h2 className="font-stardom font-bold text-2xl lg:text-3xl text-[#223148]">
                Connectez-vous
              </h2>
            </div>

            <div className="space-y-6 font-dropline">
              <div className="flex flex-col">
                <label
                  htmlFor="matricule"
                  className="mb-2 text-sm font-medium text-[#2f486d]"
                >
                  Matricule
                </label>
                <Input
                  id="matricule"
                  label="Matricule"
                  placeholder="Entrez votre matricule"
                  value={matricule}
                  required={true}
                  sx={{ width: "100%" }}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="mb-2 text-sm font-medium text-[#2f486d]"
                >
                  Mot de Passe
                </label>
                <Input
                  id="password"
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  type="password"
                  value={password}
                  required={true}
                  sx={{ width: "100%" }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center">
                <Checkbox
                  sx={{
                    color: "#2f486d",
                    "&.Mui-checked": {
                      color: "#223148",
                    },
                  }}
                />
                <span className="text-sm text-[#2f486d] font-eirene">Se souvenir de moi</span>
              </div>

              <div className="flex justify-center">
                <DefaultButton
                  bgColor="#24344D"
                  text="#F5ECE3"
                  label={loading ? "Connexion..." : "Connexion"}
                  type="submit"
                  disabled={loading}
                />
              </div>

              <div className="text-right mr-32">
                <Link
                  to="/verify"
                  className="text-sm text-[#2f486d] hover:text-[#223148] underline transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </form>

          <div className="text-start">
            <p className="text-sm text-[#2f486d]">
              Pas de compte ?&nbsp;
              <Link
                to="/signup"
                className="underline text-[#223148] hover:text-[#2f486d] font-dropline transition-colors"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;