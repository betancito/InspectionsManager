import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" component="div" className="text-white">
          Inspecciones
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate("/login")}
          sx={{ borderColor: "white", color: "white" }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
