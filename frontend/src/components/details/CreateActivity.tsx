import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
//redux imports
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { 
  closeActivityModal, 
  createActivity, 
  setActivityField 
} from "../../features/slicers/Details/createActivitySlice";
import { InspectionModel as Inspection } from "../../utils/types";

const CreateActivityModal: React.FC<{ inspection: Inspection }> = ({ inspection }) => {
  const dispatch = useDispatch();
  const { open, activity, uploadStatus, error } = useSelector((state: RootState) => state.createActivity);
  
  const handleClose = () => dispatch(closeActivityModal());
  
  const handleChange = (field: string, value: string | number) => {
    dispatch(setActivityField({ field, value }));
  };
  
  const handleSave = () => {
    dispatch(createActivity());
  };
  
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Crear Actividad</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={activity?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={activity?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
        <TextField
          label="Encargado"
          fullWidth
          margin="normal"
          value={activity?.inChargeOf || ""}
          onChange={(e) => handleChange("inChargeOf", e.target.value)}
          required
        />
        <TextField
          label="Latitud"
          type="number"
          fullWidth
          margin="normal"
          value={activity?.latitude || ""}
          onChange={(e) => handleChange("latitude", Number(e.target.value))}
          required
        />
        <TextField
          label="Longitud"
          type="number"
          fullWidth
          margin="normal"
          value={activity?.longitude || ""}
          onChange={(e) => handleChange("longitude", Number(e.target.value))}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained" 
          color="primary"
          disabled={uploadStatus === "loading"}
        >
          {uploadStatus === "loading" ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateActivityModal;