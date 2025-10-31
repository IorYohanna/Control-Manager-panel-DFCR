import React from "react";
import Button from "@mui/material/Button";

const DefaultButton = ({ bgColor = "#a63a50", text = "#ffffff", label = " " , type="submit", disabled}) => {
  return (
    <Button
      variant="contained"
      size="large"
      type={type}
      disabled={disabled}
      sx={{
        backgroundColor: bgColor,
        color: text,
        fontFamily: "Open Sans",
        borderRadius: "10px",
        px: 15,
        py: 1.5,
        "&:hover": {
          backgroundColor: bgColor, // garde la même couleur au hover, ou tu peux assombrir
        },
      }}

    >
      {label}
    </Button>
  );
};

export default DefaultButton;
