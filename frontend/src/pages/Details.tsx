import React from "react";
import {
  Container,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { Inspection } from "../components/dashboard/EditModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RootState } from "../features/store";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";



const Details: React.FC = () => {
  const {isAdmin} = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { id } = useParams();

  const inspection: Inspection | null = location.state?.inspection || null;

  return (
    <Container maxWidth="sm">
      <DialogTitle>Detalles de la inspección</DialogTitle>
      <DialogContent dividers>
        {inspection ? (
          <>
            <Typography variant="subtitle1">ID: {inspection.id}</Typography>
            <Typography variant="subtitle1">Encargado: {inspection.title.slice(2, -3)}</Typography>
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
    </Container>
  )
}

export default Details