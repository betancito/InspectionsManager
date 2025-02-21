import React from "react";
import {
  Typography,
  Card,
} from "@mui/material";

const MainSection = () => {
    return (
        <Card elevation={3} sx={{ p: 6, mt: 6, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Bienvenido al administrador de inspecciones
            </Typography>
            <Typography variant="body1">
              Realiza la gestión de tus inspecciones con nuestra herramienta.
            </Typography>
          </Card>
    );
}

export default MainSection;