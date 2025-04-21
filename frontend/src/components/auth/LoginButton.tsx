import React from 'react'
import { Button } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'

function LoginButton() {
    const {loginWithRedirect} = useAuth0();
  return (
    <Button
        variant="outlined"
        color="inherit"
        onClick={() => loginWithRedirect()}
        sx={{ borderColor: "white", color: "white", marginRight: 2 }}
    >
        Ingresar
    </Button>
  )
}

export default LoginButton