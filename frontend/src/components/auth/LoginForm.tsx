import React, {useState} from 'react';
import { TextField, Button, Alert, Card, CardContent, Typography } from '@mui/material';

interface props {
    error : string,
    onSubmit: (username: string, password: string) => void;
}
const LoginForm: React.FC<props> = ({onSubmit, error}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //Function to handle the form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try{
            onSubmit(username, password);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Ingresar
                </Typography>
                {/* Error message advice to user */}
                {error && <Alert severity="error">{error}</Alert>}
                <br />
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre de Usuario"
                        type="string"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Ingresar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
