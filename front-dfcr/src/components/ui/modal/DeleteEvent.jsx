import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Fade,
} from "@mui/material";

const ModalDelete = ({ open, formData, close, onDelete }) => (
  <Dialog
    open={open}
    onClose={close}
    maxWidth="xs"
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
    <DialogTitle
      sx={{
        px: 4,
        pt: 4,
        pb: 2,
        fontWeight: 700,
        fontSize: '1.5rem',
        color: '#2d466e'
      }}
    >
      Supprimer l'événement
    </DialogTitle>
    <DialogContent sx={{ px: 4, pb: 3 }}>
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          p: 2.5
        }}
      >
        <Typography sx={{ color: '#2d466e', lineHeight: 1.6, m: 0 }}>
          Voulez-vous vraiment supprimer{' '}
          <strong style={{ fontWeight: 700 }}>{formData.title}</strong> ?
        </Typography>
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
        onClick={() => onDelete(formData.idEvent)}
        variant="contained"
        sx={{
          px: 3,
          py: 1.25,
          borderRadius: '50px',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.938rem',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: '#b91c1c',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
          }
        }}
      >
        Supprimer
      </Button>
    </DialogActions>
  </Dialog>
);

export default ModalDelete