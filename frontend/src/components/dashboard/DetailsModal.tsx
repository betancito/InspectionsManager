// src/components/inspections/DetailsInspectionModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Inspection } from "./EditModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAuth } from "../../context/AuthContext";



interface props {
  open: boolean;
  inspection: Inspection | null;
  onClose: () => void;
}

const DetailsInspectionModal: React.FC<props> = ({
  open,
  inspection,
  onClose,
}) => {
  const {isAdmin} = useAuth();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detalles de la inspección</DialogTitle>
      <DialogContent dividers>
        {inspection ? (
          <>
            <Typography variant="subtitle1">ID: {inspection.id}</Typography>
            <Typography variant="subtitle1">Titulo: {inspection.title}</Typography>
            <Typography variant="subtitle1">Descripción: {inspection.description}</Typography>
            <Typography variant="subtitle1">
              Latitud: {inspection.latitude}
            </Typography>
            <Typography variant="subtitle1">
              Longitud: {inspection.longitude}
            </Typography>
            <Typography variant="subtitle1">
              Fecha de inspección: {inspection.due_date}
            </Typography>
            {isAdmin && 
            <Typography variant="subtitle1">
            Fecha de creación: {inspection.created_at}
            </Typography>
            }
            {isAdmin && 
            <Typography variant="subtitle1">
            Fecha de actualización {inspection.updated_at}
            </Typography>
            }
            {/* Leaflet Map */}
            <div style={{height: "400px", width: "100%", marginTop: "1rem"}}>
              <MapContainer center={[inspection.latitude, inspection.longitude]} zoom={13} style={{height: "100%", width: "100%"}}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[inspection.latitude, inspection.longitude]}>
                  <Popup>
                    {inspection.title}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            {/* End Leaflet Map */}
          </>
        ) : (
          <Typography>No ha seleccionado una inspección</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsInspectionModal;
