import React from 'react'
import { Button } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'

function Logout() {
    const  {logout} = useAuth0();
  return (
    <Button
    variant="outlined"
    color="inherit"
    onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
    sx={{ borderColor: "white", color: "white", marginRight: 2 }}
    >
        Salir de la cuenta
    </Button>
  )
}

export default Logout