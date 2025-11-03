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
  Typography,
  Fade,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  AccountCircle as AccountCircleIcon
} from "@mui/icons-material";

const ModalEdit = ({ open, isEdit, formData, setFormData, close, onEdit, onCreate }) => (
  <Dialog
    open={open}
    onClose={close}
    maxWidth="md"
    fullWidth
    TransitionComponent={Fade}
    transitionDuration={300}
    PaperProps={{
      sx: {
        borderRadius: '24px',
        backgroundColor: '#f5ece3',
        boxShadow: '0 25px 80px rgba(45, 70, 110, 0.2)',
        backgroundImage: 'none',
        maxHeight: '90vh'
      }
    }}
    BackdropProps={{
      sx: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)'
      }
    }}
  >
    <DialogTitle sx={{ px: 4, pt: 4, pb: 3, position: 'relative' }}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#2d466e',
            fontSize: '1.5rem',
            mb: 1
          }}
        >
          {isEdit ? "Modifier l'événement" : "Créer un événement"}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: '#73839e',
            fontWeight: 500,
            m: 0
          }}
        >
          Un événement à faire savoir!
        </Typography>
      </Box>
      <IconButton
        onClick={close}
        size="small"
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: '50%',
          color: '#73839e',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            color: '#2d466e'
          }
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent sx={{ px: 4, pb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Title */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            p: 2.5
          }}
        >
          <TextField
            label="Titre de l'événement"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            variant="standard"
            InputProps={{
              sx: {
                fontSize: '1.125rem',
                color: '#2d466e',
                fontWeight: 500,
                '&:before': { borderColor: '#73839e' },
                '&:after': { borderColor: '#2d466e' }
              }
            }}
            InputLabelProps={{
              sx: { color: '#73839e', fontSize: '0.938rem' }
            }}
          />
        </Box>

        {/* Email */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            px: 2.5,
            py: 2
          }}
        >
          <AccountCircleIcon sx={{ color: '#2d466e', fontSize: '2rem' }} />
          <Typography sx={{ fontWeight: 500, color: '#2d466e' }}>
            Email@example.com
          </Typography>
        </Box>

        {/* Dates */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              p: 2.5
            }}
          >
            <TextField
              label="Début"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              fullWidth
              variant="standard"
              slotProps={{
                inputLabel: {
                  shrink: true,
                  sx: { color: '#73839e', fontSize: '0.938rem' }
                },
                input: {
                  sx: {
                    color: '#2d466e',
                    '&:before': { borderColor: '#73839e' },
                    '&:after': { borderColor: '#2d466e' }
                  }
                }
              }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              p: 2.5
            }}
          >
            <TextField
              label="Fin"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              fullWidth
              variant="standard"
              slotProps={{
                inputLabel: {
                  shrink: true,
                  sx: { color: '#73839e', fontSize: '0.938rem' }
                },
                input: {
                  sx: {
                    color: '#2d466e',
                    '&:before': { borderColor: '#73839e' },
                    '&:after': { borderColor: '#2d466e' }
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            p: 2.5
          }}
        >
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={4}
            variant="standard"
            InputProps={{
              sx: {
                color: '#2d466e',
                '&:before': { borderColor: '#73839e' },
                '&:after': { borderColor: '#2d466e' }
              }
            }}
            InputLabelProps={{
              sx: { color: '#73839e', fontSize: '0.938rem' }
            }}
          />
        </Box>

        {/* Checkbox */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            px: 2.5,
            py: 1.5
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                sx={{
                  color: '#2d466e',
                  '&.Mui-checked': { color: '#2d466e' }
                }}
              />
            }
            label="Événement toute la journée"
            sx={{
              color: '#2d466e',
              fontWeight: 500,
              '& .MuiFormControlLabel-label': { fontSize: '0.938rem' }
            }}
          />
        </Box>
      </Box>
    </DialogContent>

    <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1.5 }}>
      <Button
        onClick={close}
        sx={{
          px: 3,
          py: 1.25,
          borderRadius: '50px',
          color: '#73839e',
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.938rem',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }
        }}
      >
        Annuler
      </Button>
      <Box sx={{ flex: 1 }} />
      <Button
        onClick={isEdit ? onEdit : onCreate}
        variant="contained"
        sx={{
          px: 4,
          py: 1.25,
          borderRadius: '50px',
          backgroundColor: '#2d466e',
          color: '#f5ece3',
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.938rem',
          boxShadow: '0 4px 12px rgba(45, 70, 110, 0.3)',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: '#1f2f4d',
            boxShadow: '0 6px 20px rgba(45, 70, 110, 0.4)'
          }
        }}
      >
        {isEdit ? 'Enregistrer les modifications' : "Créer l'événement"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ModalEdit