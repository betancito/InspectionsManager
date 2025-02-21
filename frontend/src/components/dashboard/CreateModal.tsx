// src/components/inspections/EditInspectionModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export interface Inspection {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  due_date: string;
}

interface props {
  open: boolean;
  onClose: () => void;
  onSave: (updatedInspection: Inspection) => void;
}

const CreateInspectionModal: React.FC<props> = ({
  open,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dueDate, setDueDate] = useState(""); 

  const handleSave = () => {
    const inspectionTosave : Inspection = {
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      due_date: dueDate,
    };
    onSave(inspectionTosave);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear inspección</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
         <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Latitud"
          fullWidth
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Longitud"
          fullWidth
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha de inspección"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancerlar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInspectionModal;
