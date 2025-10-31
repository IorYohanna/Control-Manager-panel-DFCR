import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export const EventModal = ({
  open,
  setOpen,
  type,
  formData,
  setFormData,
  onCreate,
  onEdit,
  onDelete
}) => {
  const close = () => setOpen(false);

  // 🔵 CONTENU DU MODE VIEW (lecture seule)
  if (type === "view") {
    return (
      <Dialog open={open} onClose={close}>
        <DialogTitle>Détails de l'événement</DialogTitle>

        <DialogContent className="flex flex-col gap-3 w-96">
          <p><b>Titre :</b> {formData.title}</p>
          <p><b>Description :</b> {formData.description}</p>
          <p><b>Début :</b> {formData.startTime.toString()}</p>
          <p><b>Fin :</b> {formData.endTime.toString()}</p>
          <p><b>Toute la journée :</b> {formData.allDay ? "Oui" : "Non"}</p>
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>Fermer</Button>
          <Button onClick={() => setFormData({ ...formData })} variant="contained">Modifier</Button>
          <Button color="error" onClick={() => onDelete(formData.idEvent)}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 🔴 CONFIRMATION SUPPRESSION
  if (type === "delete") {
    return (
      <Dialog open={open} onClose={close}>
        <DialogTitle>Supprimer l'événement</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer <b>{formData.title}</b> ?
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Annuler</Button>
          <Button color="error" onClick={() => onDelete(formData.idEvent)}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 🟢 MODE CREATE & EDIT -> mêmes inputs
  const isEdit = type === "edit";

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>
        {isEdit ? "Modifier l'événement" : "Créer un événement"}
      </DialogTitle>

      <DialogContent className="flex flex-col gap-4 w-96">

        <TextField
          label="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
        />

        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          fullWidth
        />

        <TextField
          label="Date de début"
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
          fullWidth
        />

        <TextField
          label="Date de fin"
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })
          }
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.allDay}
              onChange={(e) =>
                setFormData({ ...formData, allDay: e.target.checked })
              }
            />
          }
          label="Toute la journée"
        />

        <TextField
          label="Couleur"
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData({ ...formData, color: e.target.value })
          }
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={close}>Annuler</Button>

        <Button
          variant="contained"
          color="primary"
          onClick={isEdit ? onEdit : onCreate}
        >
          {isEdit ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
