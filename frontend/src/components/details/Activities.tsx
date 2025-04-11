import React from "react";
import {
  Fade,
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/customHooks";
import CreateActivityModal from "./CreateActivity";
import { InspectionModel as Inspection } from "../../utils/types";
import { fetchActivities } from "../../features/slicers/Details/activitiesSlice";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { openActivityModal } from "../../features/slicers/Details/createActivitySlice";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { createExcelTemplate } from "../../utils/excelHelpers";
import UploadExcelModal from "./UploadActivities";


const Activies: React.FC<{ inspection: Inspection }> = ({ inspection }) => {
  const dispatch =  useAppDispatch();
  const { activities, loading, error } = useAppSelector((state) => state.activities);
  const inspection_id = inspection.id


  useEffect(() => {
    dispatch(fetchActivities(inspection_id))
  }, [dispatch]);

  if (loading === "pending"){
    return(
      <Box
      sx={{
        display:"flex",
        flexDirection:"center",
        alignItems:"center",
        justifyContent:"center",
        minHeight:"200px",
        padding:4,
      }}
      >
        <CircularProgress size={60} thickness={4}/>
        <Typography variant="h6" color="textSecondary" sx={{marginTop:16}}>
          Cargando Usuarios...
        </Typography>
      </Box>
    )
  }

  if (loading === 'failed') {
    return (
      <Fade in={true} timeout={500}>
        <Alert 
          severity="error" 
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          sx={{ 
            marginTop: 2, 
            marginBottom: 2
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Failed to load users
          </Typography>
          <Typography variant="body2">
            {error || "An unknown error occurred. Please try again."}
          </Typography>
        </Alert>
      </Fade>
    );
  }
  
  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Actividades
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(openActivityModal(inspection))}
          >
            Crear nueva actividad
          </Button>
          <UploadExcelModal 
            inspection={inspection}
            onComplete={() => dispatch(fetchActivities(inspection.id))}
          />
        </Box>
        {activities.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Encargado</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.id}</TableCell>
                    <TableCell>{activity.title}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.in_charge_of}</TableCell>
                    <TableCell>{activity.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No hay actividades disponibles para esta inspección.
          </Typography>
        )}
        <Button
          variant ="outlined"
          color="info"
          startIcon={<CloudDownloadIcon />}
          onClick={createExcelTemplate}
        >
          Descargar plantilla de actividades
        </Button>
      </Container>
      
      <CreateActivityModal inspection={inspection}/>

    </>
  );
};

export default Activies;