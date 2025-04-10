import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";



const CreateActivityModal: React.FC = () => {

  
  
  return (
    <Dialog open={false} fullWidth maxWidth="sm">
      <DialogTitle>Crear Actividad</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={null}
          onChange={() => {}}
        />
        <TextField
          label="Descripción"
          fullWidth
          margin="normal"
          value={null}
          onChange={() => {}}
        />
        <TextField
          label="Encargado"
          fullWidth
          margin="normal"
          value={null}
          onChange={() => {}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {}} color="secondary">
          Cancelar
        </Button>
        <Button onClick={() => {}} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateActivityModal;