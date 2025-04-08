import React from "react";
import {
  Container,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardMedia,
} from "@mui/material";
import { API_URL, InspectionModel } from "../utils/constants";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RootState } from "../features/store";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Details: React.FC = () => {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const inspection: InspectionModel | null = location.state?.inspection || null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Basic details panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: "100%" }}>
            <DialogTitle>Detalles de la inspección</DialogTitle>
            <DialogContent dividers>
              {inspection ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="subtitle1">
                    ID: {inspection.id}
                  </Typography>
                  <Typography variant="subtitle1">
                    Encargado: {inspection.title}
                  </Typography>
                  <Typography variant="subtitle1">
                    Descripción: {inspection.description}
                  </Typography>
                  <Typography variant="subtitle1">
                    Latitud: {inspection.latitude}
                  </Typography>
                  <Typography variant="subtitle1">
                    Longitud: {inspection.longitude}
                  </Typography>
                  <Typography variant="subtitle1">
                    Fecha de inspección: {inspection.due_date}
                  </Typography>
                  {isAdmin && (
                    <>
                      <Typography variant="subtitle1">
                        Fecha de creación: {inspection.created_at}
                      </Typography>
                    </>
                  )}
                  {!isMobile && (
                    <Box sx={{ height: "400px", width: "100%", mt: 2 }}>
                      <MapContainer
                        center={[inspection.latitude, inspection.longitude]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[inspection.latitude, inspection.longitude]}
                        >
                          <Popup>{inspection.title}</Popup>
                        </Marker>
                      </MapContainer>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography>No ha seleccionado una inspección</Typography>
              )}
            </DialogContent>
          </Paper>
        </Grid>

        {/* Second Panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: "100%" }}>
            <DialogTitle>Informacion de inspección completada</DialogTitle>
            <DialogContent dividers>
              {inspection?.completed ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="subtitle1">
                    Descripción: {inspection.completed_description}
                  </Typography>
                  <Typography variant="subtitle1">
                    Latitud de la imagen: {inspection.completed_lat}
                  </Typography>
                  <Typography variant="subtitle1">
                    Longitud de la imagen: {inspection.completed_log}
                  </Typography>
                  {isAdmin && (
                    <>
                      <Typography variant="subtitle1">
                        Fecha de Completación: {inspection.updated_at}
                      </Typography>
                    </>
                  )}
                  <Box sx={{ height: "100%", width: "100%", mt: 2 }}>
                    <Typography variant="h6">
                      Imagen de la inspección
                    </Typography>
                    <Card
                      sx={{
                        width: "100%",
                        height: "100%", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain", 
                          width: "auto", 
                          height: "auto", 
                        }}
                        image={`${API_URL}${inspection.completed_editedFile}`}
                        alt="Imagen Original"
                      />
                    </Card>
                  </Box>
                </Box>
              ) : (
                <Typography>No se ha Completado la inspección</Typography>
              )}
            </DialogContent>
          </Paper>
        </Grid>

        {/* Full-width map on mobile */}
        {isMobile && inspection && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ mt: 2 }}>
              <DialogTitle>Ubicación</DialogTitle>
              <DialogContent>
                <Box sx={{ height: "300px", width: "100%" }}>
                  <MapContainer
                    center={[inspection.latitude, inspection.longitude]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[inspection.latitude, inspection.longitude]}
                    >
                      <Popup>{inspection.title}</Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              </DialogContent>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Details;
