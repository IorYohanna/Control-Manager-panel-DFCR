import React from "react";
import Button from "@mui/material/Button";

const AuthButton = ({ bgColor = "#a63a50", text = "#ffffff", label = "Connexion" }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: bgColor,
        color: text,
        fontFamily: "Open Sans",
        borderRadius: "10px",
        px: 4, 
        py: 1.5,
        "&:hover": {
          backgroundColor: bgColor, // garde la même couleur au hover, ou tu peux assombrir
        },
      }}
      size="large"
    >
      {label}
    </Button>
  );
};

export default AuthButton;
