// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import EditInspectionModal from "../components/dashboard/EditModal";
import CreateInspectionModal from "../components/dashboard/CreateModal";
import { InspectionModel as InspectionToSave } from "../utils/types";
import { Link } from "react-router-dom";
import CheckModal from "../components/dashboard/CheckModal";
import { useDispatch } from "react-redux";
import { openCheckModal } from "../features/slicers/dashboard/checkSlice";
import { logout } from "../features/slicers/Auth/authSlice";
import { API_URL } from "../utils/types";
import { RootState } from "../features/store";
import { useSelector } from "react-redux";
import { InspectionModel as Inspection } from "../utils/types";


const Dashboard: React.FC = () => {

  // Variables for the dashboard
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // Auth check
  const {role_group} = useSelector((state: RootState) => state.auth);

  // States for modals:
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  //handleLogout function
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  }

  //Initial fetcher for populating inspections
  const fetchInspections = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      const response = await axios.get(`${API_URL}/inspections/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      //Ensure Inspections array
      const inspectionsData =  Array.isArray(response.data) ? response.data : [];
      setInspections(inspectionsData);
    } catch (err) {
      console.error("Error fetching inspections:", err);
      setError("Failed to fetch inspections");
      //Set inspections to none when error happens
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inspections on component mount
  useEffect(() => {
    fetchInspections();
  }, []);

  // Edit handler to send info to the modal
  const handleEditClick = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setEditModalOpen(true);
  };

  // Save handler for inspection edit modal
  const handleSaveEdit = async (updatedInspection: Inspection) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      
      await axios.put(`${API_URL}/inspections/${updatedInspection.id}/`, updatedInspection, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      // Update the state locally or refetch data
      setInspections(prev => prev.map(i => i.id === updatedInspection.id ? updatedInspection : i));
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating inspection:", error);
    }
  };

  //onSave handler for inspection create modal
  const handleCreate = async (newInspection: InspectionToSave) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      const response = await axios.post(`${API_URL}/inspections/`, newInspection, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      // Update the state locally or refetch data
      setInspections(prev => [...prev, response.data]);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating inspection:", error);
    }
  };

  //Delete handler
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      await axios.delete(`${API_URL}/inspections/${id}/`, {
        headers: {
          "Content-Type": "application",
          "Authorization": `Bearer ${token}`,
        },
      });
      setInspections(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error("Error deleting inspection:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="mt-10">
      <div className="maxWidth flex display-flex justify-between" style={{ marginTop: "30px", alignItems: "center", marginBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        { role_group &&
        <Button variant="contained" color="primary" onClick={()=>setCreateModalOpen(true)}>
          Crear inspección
        </Button>
    }   
        <Button onClick={handleLogout}>Salir de la cuenta</Button>
      </div>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Inspector</TableCell>
                <TableCell>Fecha de inspección</TableCell>
                <TableCell>Acciones</TableCell>
                <TableCell>Completada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(inspections) && inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.id}</TableCell>
                  <TableCell>{inspection.title.includes("(") ? inspection.title.slice(2, -3) : inspection.title}</TableCell>
                  <TableCell>{inspection.due_date}</TableCell>
                  <TableCell>
                    { role_group === 'admin' &&(
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => (handleEditClick(inspection))}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Editar
                    </Button>
                    )}
                    <Link to={`/inspection/${inspection.id}`} state={{inspection}}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      style={{ marginRight: "0.5rem" }}
                    >
                      Detalles
                    </Button>
                    </Link>
                    { role_group === 'admin' &&
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(inspection.id)}
                    >
                      Eliminar
                    </Button>
                    }
                  </TableCell>
                  {(role_group === 'admin' || role_group === 'inspector') ? (
                    inspection.completed ? (
                      <TableCell sx={{justifyContent: "center"}}>
                        <CheckIcon color="success" />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="warning" 
                          onClick={() => dispatch(openCheckModal(inspection.id))}
                        >
                          Completar Inspección
                        </Button>
                      </TableCell>
                    )
                  ) : (
                    /* For other roles (analyst, viewer), just show check or X icon */
                    <TableCell sx={{justifyContent: "center"}}>
                      {inspection.completed ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                  )}
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Edit Modal */}
      <EditInspectionModal
        open={editModalOpen}
        inspection={selectedInspection}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
      {/* Create modal */}
      <CreateInspectionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />
      {/* Check Modal */}
      <CheckModal/>
    </Container>
  );
};

export default Dashboard;
