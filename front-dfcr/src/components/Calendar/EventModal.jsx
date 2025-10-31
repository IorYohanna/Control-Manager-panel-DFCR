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
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

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

  // Palette de couleurs prédéfinies
  const colorPalette = [
    "#3b82f6", // Bleu
    "#8b5cf6", // Violet
    "#ec4899", // Rose
    "#f59e0b", // Orange
    "#10b981", // Vert
    "#06b6d4", // Cyan
    "#f43f5e", // Rouge
    "#6366f1", // Indigo
  ];

  // 🔵 CONTENU DU MODE VIEW (lecture seule)
  if (type === "view") {
    return (
      <Dialog 
        open={open} 
        onClose={close}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid #f3f4f6'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: formData.color || '#3b82f6',
              }}
            />
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {formData.title}
            </span>
          </Box>
          <IconButton onClick={close} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            
            {formData.description && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <DescriptionIcon sx={{ color: '#6b7280', mt: 0.5 }} />
                <Box>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                    Description
                  </p>
                  <p style={{ margin: 0, color: '#1f2937' }}>{formData.description}</p>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <CalendarIcon sx={{ color: '#6b7280', mt: 0.5 }} />
              <Box>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                  Date et heure
                </p>
                <p style={{ margin: 0, color: '#1f2937', marginBottom: '4px' }}>
                  <strong>Début :</strong> {new Date(formData.startTime).toLocaleString('fr-FR')}
                </p>
                <p style={{ margin: 0, color: '#1f2937' }}>
                  <strong>Fin :</strong> {new Date(formData.endTime).toLocaleString('fr-FR')}
                </p>
              </Box>
            </Box>

            {formData.allDay && (
              <Chip 
                label="Toute la journée" 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ width: 'fit-content' }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
          <Button 
            onClick={close}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Fermer
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button 
            onClick={() => setFormData({ ...formData })} 
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Modifier
          </Button>
          <Button 
            color="error" 
            onClick={() => onDelete(formData.idEvent)}
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 🔴 CONFIRMATION SUPPRESSION
  if (type === "delete") {
    return (
      <Dialog 
        open={open} 
        onClose={close}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Supprimer l'événement
        </DialogTitle>
        <DialogContent>
          <p style={{ margin: 0 }}>
            Voulez-vous vraiment supprimer <strong>{formData.title}</strong> ?
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={close}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Annuler
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={() => onDelete(formData.idEvent)}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 🟢 MODE CREATE & EDIT -> Layout horizontal moderne
  const isEdit = type === "edit";

  return (
    <Dialog 
      open={open} 
      onClose={close}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        borderBottom: '1px solid #f3f4f6'
      }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {isEdit ? "Modifier l'événement" : "Créer un événement"}
        </span>
        <IconButton onClick={close} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Titre + Couleur (horizontal) */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
          <TextField
            label="Titre de l'événement"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          {/* Sélecteur de couleur avec palette */}
          <Box sx={{ minWidth: 180 }}>
            <p style={{ 
              margin: 0, 
              marginBottom: 8, 
              fontSize: '0.75rem', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Couleur
            </p>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              p: 1.5,
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              bgcolor: '#f9fafb'
            }}>
              {colorPalette.map((color) => (
                <Box
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: color,
                    cursor: 'pointer',
                    border: formData.color === color ? '3px solid #1f2937' : '2px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          fullWidth
          multiline
          rows={3}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />

        {/* Dates en horizontal */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Date et heure de début"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <TextField
            label="Date et heure de fin"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Box>

        {/* Checkbox toute la journée */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.allDay}
              onChange={(e) =>
                setFormData({ ...formData, allDay: e.target.checked })
              }
              sx={{
                color: '#3b82f6',
                '&.Mui-checked': {
                  color: '#3b82f6',
                }
              }}
            />
          }
          label="Événement toute la journée"
          sx={{ 
            '& .MuiFormControlLabel-label': { 
              fontWeight: 500,
              color: '#374151' 
            } 
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button 
          onClick={close}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 500,
            color: '#6b7280'
          }}
        >
          Annuler
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={isEdit ? onEdit : onCreate}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 500,
            borderRadius: 2,
            bgcolor: '#3b82f6',
            px: 4,
            boxShadow: 'none',
            '&:hover': { 
              bgcolor: '#2563eb',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' 
            }
          }}
        >
          {isEdit ? "Enregistrer les modifications" : "Créer l'événement"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};