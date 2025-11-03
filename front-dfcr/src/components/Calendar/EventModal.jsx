import React from "react";
import {Dialog,DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Box, IconButton, Chip, Typography} from "@mui/material";
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, CalendarMonth as CalendarIcon, Description as DescriptionIcon} from "@mui/icons-material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const ModalView = ({ open, formData, close , onEditMode, onDelete}) => (
  <Dialog
    open={open}
    onClose={close}
    maxWidth="sm"
    fullWidth
    className="rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
  >
    <DialogTitle className="flex justify-between items-center pb-2 border-b border-gray-100">
      <Box className="flex items-center gap-1">
        <Box
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: formData.color || "#3b82f6" }}
        />
        <span className="text-lg font-semibold">{formData.title}</span>
      </Box>
      <IconButton onClick={close} size="small" className="hover:bg-gray-100 rounded">
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent className="pt-3 pb-2">
      <Box className="flex flex-col gap-2.5">
        {formData.description && (
          <Box className="flex gap-2 items-start">
            <DescriptionIcon className="text-gray-400 mt-1" />
            <Box>
              <Typography className="text-sm text-gray-400 mb-1">Description</Typography>
              <Typography className="text-gray-800">{formData.description}</Typography>
            </Box>
          </Box>
        )}

        {formData.allDay && (
          <Chip
            label="Toute la journée"
            size="small"
            color="primary"
            variant="outlined"
            className="w-fit"
          />
        )}
      </Box>
    </DialogContent>

    <DialogActions className="flex px-3 pb-3 pt-2 gap-1">
      <Button className="text-gray-500 font-medium normal-case" onClick={close}>
        Fermer
      </Button>
      <Box className="flex-1" />
      <Button
        onClick={onEditMode}
        variant="contained"
        startIcon={<EditIcon />}
        className="text-white font-medium normal-case rounded-lg shadow-none hover:shadow-none"
      >
        Modifier
      </Button>
      <Button
        color="error"
        onClick={() => onDelete(formData.idEvent)}
        variant="outlined"
        startIcon={<DeleteIcon />}
        className="text-red-600 font-medium normal-case rounded-lg"
      >
        Supprimer
      </Button>
    </DialogActions>
  </Dialog>
)

const ModalDelete = ({ open, formData , close, onDelete}) => (
  <Dialog open={open} onClose={close} maxWidth="xs" PaperProps={{ className: "rounded-xl" }}>
    <DialogTitle className="font-semibold">Supprimer l'événement</DialogTitle>
    <DialogContent>
      <p className="m-0">
        Voulez-vous vraiment supprimer <strong>{formData.title}</strong> ?
      </p>
    </DialogContent>
    <DialogActions className="px-3 pb-3">
      <Button className="text-gray-500 font-medium normal-case" onClick={close}>
        Annuler
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={() => onDelete(formData.idEvent)}
        className="text-white font-medium normal-case rounded-lg shadow-none hover:shadow-none"
      >
        Supprimer
      </Button>
    </DialogActions>
  </Dialog> 
)

const ModalEdit = ({ open, isEdit, formData, setFormData, close, onEdit, onCreate }) => (
  <Dialog
    open={open}
    onClose={close}
    maxWidth="md"
    fullWidth
    className="rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
  >
    <DialogTitle className="flex justify-between items-center pb-2 border-b border-gray-100">
      <span className="text-lg font-semibold">
        {isEdit ? "Modifier l'événement" : "Créer un événement"}
      </span>
      <IconButton onClick={close} size="small" className="hover:bg-gray-100 rounded">
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent className="pt-3 pb-2 space-y-4">
      {/* Titre */}
      <Box className="flex gap-2 mb-3 items-start">
        <TextField
          label="Titre de l'événement"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
          variant="standard"
          className="rounded-lg"
        />
      </Box>

      {/* Email */}
      <Box className="flex items-center gap-3 px-3 py-2">
        <AccountCircleIcon color="primary" className="text-blue-500" />
        <Typography>Email@example.com</Typography>
      </Box>

      {/* Dates */}
      <Box className="flex gap-2 mb-2">
        <TextField
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          fullWidth
          slotProps={{ InputLabelProps: { shrink: true } }}
          className="rounded-lg"
        />
        <TextField
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          fullWidth
          slotProps={{ InputLabelProps: { shrink: true } }}
          className="rounded-lg"
        />
      </Box>

      {/* Description */}
      <TextField
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        fullWidth
        multiline
        rows={3}
        className="rounded-lg mb-3"
      />

      {/* Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.allDay}
            onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
            className="text-blue-500"
          />
        }
        label="Événement toute la journée"
        className="text-gray-700 font-medium"
      />
    </DialogContent>

    <DialogActions className="flex px-3 pb-3 pt-2 gap-1">
      <Button
        onClick={close}
        className="text-gray-500 font-medium normal-case"
      >
        Annuler
      </Button>
      <Box className="flex-1" />
      <Button
        variant="contained"
        onClick={isEdit ? onEdit : onCreate}
        className="bg-blue-500 hover:bg-blue-600 hover:shadow-lg text-white font-medium normal-case rounded-lg px-6 shadow-none"
      >
        {isEdit ? "Enregistrer les modifications" : "Créer l'événement"}
      </Button>
    </DialogActions>
  </Dialog>
)


  
export const EventModal = (props) => {
  const close = () => setOpen(false);
  const {type, setOpen } = props

  if (type === "view") return <ModalView {...props} close={close} />;
  if (type === "delete") return <ModalDelete {...props} close={close} />;
  return <ModalEdit isEdit={type === "edit"} {...props} close={close} />;
};