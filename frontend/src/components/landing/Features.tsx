import {
    Typography,
    Card,
  } from "@mui/material";

const Features = () => {
    return (
        <Card elevation={3} sx={{ p: 6, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
            Características
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
            <li>Programación sencilla de inspecciones</li>
            <li>Ubicaciónes con mapa interactivo</li>
            <li>Gestion de inspecciones en base al rol del usuario</li>
        </ul>
        </Card>
    );
}

export default Features;