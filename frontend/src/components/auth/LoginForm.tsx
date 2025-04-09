import React, {useState} from 'react';
import { TextField, Button, Alert, Card, CardContent, Typography } from '@mui/material';
import { RootState } from '../../features/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

interface props {
    error : string,
    onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<props> = ({onSubmit, error}) => {
    //setters
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //Redux state to see if already authenticated so login would not be required if authenticated
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    //Auth0 to handle authentication using microsoft bttn
    const { loginWithRedirect } = useAuth0();

    //Function to handle the form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try{
            onSubmit(username, password);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    // Function to render login form
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
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px',marginTop: '16px' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Ingresar
                        </Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="outlined" color="primary" onClick={() => loginWithRedirect({
                            connection: "windowslive",
                        }
                        )}>
                            <MicrosoftIcon sx={{marginRight: "8px"}}/>Ingresar con Microsoft
                        </Button>
                    </div>
                    
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
