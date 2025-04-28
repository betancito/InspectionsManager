import React, { useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import axios from "axios";
import { useAxiosWithAuth } from "../../services/axiosInterceptor";        
import { API_URL } from "../../utils/types";

const TestAuth: React.FC = () => {
  const axiosAuth = useAxiosWithAuth();                            
  const [publicData, setPublicData] = useState("");
  const [protectedData, setProtectedData] = useState("");
  const [error, setError] = useState("");

  const handlePublic = async () => {
    setError("");
    try {
      const res = await axios.get(`${API_URL}/test-public/`);        
      setPublicData(JSON.stringify(res.data));
    } catch (err: any) {
      setError(err.response?.statusText || "Error fetching public");
    }
  };

  const handleProtected = async () => {
    setError("");
    try {
      const res = await axiosAuth.get(`${API_URL}/test-protected/`); 
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.statusText || "Protected error");
    }
  };

  return (
    <Container style={{ marginTop: 24 }}>
      <Typography variant="h5">Auth0 Test Page</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handlePublic} style={{ margin: 8 }}>
        Fetch Public
      </Button>
      <Typography>Public Response: {publicData}</Typography>

      <Button variant="contained" onClick={handleProtected} style={{ margin: 8 }}>
        Fetch Protected
      </Button>
      <Typography>Protected Response: {protectedData}</Typography>
    </Container>
  );
};

export default TestAuth;
