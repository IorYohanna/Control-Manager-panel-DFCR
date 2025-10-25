export const validateLogin = ({ matricule, password }) => {
  const errors = {};
  if (!matricule.trim()) errors.matricule = "Le matricule est requis";
  if (!password.trim()) errors.password = "Le mot de passe est requis";
  return errors;
};
