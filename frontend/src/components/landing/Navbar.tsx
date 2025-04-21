import { AppBar, Toolbar, Typography, Button, Container,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../auth/LoginButton";
import Logout from "../auth/Logout";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" component="div" className="text-white">
          Inspecciones
        </Typography>
        <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
          {/* Normal Button for Login trough API
          
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/login")}
            sx={{ borderColor: "white", color: "white", marginRight: 2 }}
          >
            Ingresar
          </Button> */}
          {/* Button Using Auth0 */}
          <LoginButton/>
          <Logout/>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/register")}
            sx={{ borderColor: "white", color: "white" }}
          >
            Registrarse
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
