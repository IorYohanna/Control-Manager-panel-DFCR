import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";

function App() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div class="grid grid-cols-2 h-screen">
        {/* Image Display*/}
        <div class="relative bg-antique-white-image w-full h-auto bg-cover bg-center">
          <div class="absolute inset-0 bg-[var(--color-background)] opacity-100 mix-blend-multiply"></div>
        </div>
        {/* Formulaire */}
        <div class="mx-auto my-auto max-auto px-4 py-16 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-lg text-center">
            <h1 class="text-2xl font-bold sm:text-3xl">Bon retour à toi!</h1>
            <p class="mt-4 text-gray-600">Ceci est facile à utiliser</p>
          </div>

          <form class="mx-auto mb-0 mt-8 max-w-md space-y-4" action="#">
            <FormControl sx={{ m: 1, width: "50ch", pb: 5 }} variant="outlined">
              <InputLabel htmlFor="matricule">Matricule</InputLabel>
              <OutlinedInput
                id="matricule"
                label="Matricule"
                placeholder="Entrez votre matricule"
              />
            </FormControl>
            <FormControl
              sx={{ m: 1, width: "50ch", pb: 10 }}
              variant="outlined"
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                label="Mot de passe"
                placeholder="Entrez votre mot de passe"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div class="flex items-center justify-between">
              <p class="text-sm">
                <Checkbox></Checkbox>
                Remember me
              </p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "var(--color-secondary)",
                  fontFamily: "Open Sans",
                  color: "var(--color-primary-foreground)",
                  borderRadius: "9999px",
                  paddingX: 4,
                  paddingY: 3,
                }}
                size="large"
              >
                Connexion
              </Button>
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
        </div>
      </div>
    </>
  );
}

export default App;
