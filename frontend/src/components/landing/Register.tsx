import { Typography, Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  return (
    <Card elevation={3} sx={{ p: 6, mt: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Empieza ahora
      </Typography>
      <Typography variant="body1" paragraph>
        Regístrate ahora y experimenta el futuro de la gestión de inspecciones.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/signup")}
        sx={{ mt: 2 }}
      >
        Registrarse
      </Button>
    </Card>
  );
};

export default Register;
