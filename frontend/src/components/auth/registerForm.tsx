import React, { useState } from "react";
import { TextField, Button, Alert, Card, CardContent, Typography, InputLabel, Select, MenuItem, Container } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { register } from "../../features/slicers/Auth/registerSlice";

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.register);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    role_group: 'admin',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Registrarse
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Correo Electronico"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Confirmar Contraseña"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
          <Container sx={{ display: "flex", justifyContent: "space-between", marginTop: 2, marginBottom: 4 }}>
            <div>
              <InputLabel id="role-group-label">Grupo de trabajo</InputLabel>
              <Select
                labelId="role-group-label"
                name="role_group"
                value={formData.role_group}
                onChange={handleChange}
              >
                <MenuItem value="admin">Administradores</MenuItem>
                <MenuItem value="inspector">Inspectores</MenuItem>
                <MenuItem value="analyst">Analistas</MenuItem>
                <MenuItem value="viewer">Clientes</MenuItem>
              </Select>
            </div>
            <div>
              <TextField
                label="Nombres"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                margin="normal"
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Apellidos"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                margin="normal"
                fullWidth
              />
            </div>
          </Container>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
            <Typography variant="body1">
              ¿Ya tienes una cuenta? <NavLink to="/login">Ingresa</NavLink>
            </Typography>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
