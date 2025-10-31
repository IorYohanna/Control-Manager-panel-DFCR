import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { X } from "lucide-react"; // icône de fermeture (optionnel, MUI + lucide)

export default function CustomModal({ title = "Titre du Modal", children, onConfirm }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    handleClose();
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <Button
        onClick={handleOpen}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition-colors"
      >
        Ouvrir Modal
      </Button>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        className="rounded-xl"
        PaperProps={{
          className: "p-4 max-w-lg w-full rounded-xl shadow-lg",
        }}
      >
        {/* Header */}
        <DialogTitle className="flex justify-between items-center text-lg font-bold text-gray-800">
          {title}
          <IconButton onClick={handleClose} size="small" className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </IconButton>
        </DialogTitle>

        {/* Contenu */}
        <DialogContent className="text-gray-700 py-2">{children}</DialogContent>

        {/* Footer */}
        <DialogActions className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
