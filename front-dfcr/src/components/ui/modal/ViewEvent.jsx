import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Chip,
  Typography,
  Fade,
  Slide
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  AccountCircle
} from "@mui/icons-material";
const ModalView = ({ open, formData, close, onEditMode, onDelete }) => (
  <Dialog
    open={open}
    onClose={close}
    maxWidth="sm"
    fullWidth
    TransitionComponent={Fade}
    transitionDuration={300}
    PaperProps={{
      sx: {
        borderRadius: '24px',
        backgroundColor: '#f5ece3',
        boxShadow: '0 25px 80px rgba(45, 70, 110, 0.2)',
        backgroundImage: 'none'
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: formData.color || '#2d466e',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#2d466e',
            fontSize: '1.5rem'
          }}
        >
          {formData.title}
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
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          p: 2.5,
          marginBottom: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <AccountCircle sx={{ color: '#73839e', fontSize: '1.25rem' }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#73839e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Créateur
          </Typography>
        </Box>
        <Typography
          sx={{
            ml: 4.5,
            color: '#2d466e',
            lineHeight: 1.6,
            fontSize: '0.938rem'
          }}
        >
          {formData.email}  |  {formData.service}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Time Info */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            p: 2.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <AccessTimeIcon sx={{ color: '#73839e', fontSize: '1.25rem' }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#73839e',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Horaire
            </Typography>
          </Box>
          <Box sx={{ ml: 4.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ color: '#2d466e', fontSize: '0.938rem' }}>
              <strong>Début:</strong>{' '}
              {new Date(formData.startTime).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </Typography>
            <Typography sx={{ color: '#2d466e', fontSize: '0.938rem' }}>
              <strong>Fin:</strong>{' '}
              {new Date(formData.endTime).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        {formData.description && (
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              p: 2.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <DescriptionIcon sx={{ color: '#73839e', fontSize: '1.25rem' }} />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#73839e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Description
              </Typography>
            </Box>
            <Typography
              sx={{
                ml: 4.5,
                color: '#2d466e',
                lineHeight: 1.6,
                fontSize: '0.938rem'
              }}
            >
              {formData.description}
            </Typography>
          </Box>
        )}

        {/* All Day Badge */}
        {formData.allDay && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
            <Chip
              label="Toute la journée"
              sx={{
                backgroundColor: '#2d466e',
                color: '#f5ece3',
                fontSize: '0.875rem',
                fontWeight: 500,
                px: 2,
                py: 2.5,
                height: 'auto',
                borderRadius: '50px',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>
        )}
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
        Fermer
      </Button>
      <Box sx={{ flex: 1 }} />
      <Button
        onClick={onEditMode}
        variant="contained"
        startIcon={<EditIcon />}
        sx={{
          px: 3,
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
        Modifier
      </Button>
      <Button
        onClick={() => onDelete(formData.idEvent)}
        variant="outlined"
        startIcon={<DeleteIcon />}
        sx={{
          px: 3,
          py: 1.25,
          borderRadius: '50px',
          borderColor: '#dc2626',
          borderWidth: 2,
          color: '#dc2626',
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.938rem',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(220, 38, 38, 0.05)',
            borderWidth: 2,
            borderColor: '#dc2626'
          }
        }}
      >
        Supprimer
      </Button>
    </DialogActions>
  </Dialog>
);

export default ModalView