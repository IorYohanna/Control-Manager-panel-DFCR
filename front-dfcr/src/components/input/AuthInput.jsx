import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";

const AuthInput = ({
  id,
  label,
  placeholder,
  type = "text", // text par défaut
  value,
  onChange,
  required = false,

  sx = { width: "50ch", pb: 2, mt: 1  },
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false)

  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  const handleMouseDownPassword = (event) =>  event.preventDefault()

  const handleBlur = () => setTouched(true)

  const hasError = required && touched && value.trim() === ""

  return (
    <FormControl sx={sx} variant="outlined">

      <InputLabel htmlFor={id} required={required}>
        {label}
      </InputLabel>

      <OutlinedInput
        id={id}
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        label={label}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        endAdornment={
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />
      {hasError && (
        <FormHelperText>Ce champ est obligatoire</FormHelperText>
      )}
    </FormControl>
  );
};

export default AuthInput
