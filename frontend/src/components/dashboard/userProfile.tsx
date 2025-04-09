import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Avatar, Box, Button } from '@mui/material';

const Profile: React.FC = () => {
  const { use, logout } = useAuth0();
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          src={user?.picture} 
          alt={user?.name}
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        <Typography variant="h5">{user?.name}</Typography>
        <Typography variant="body1">{user?.email}</Typography>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          sx={{ mt: 2 }}
        >
          Log Out
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;