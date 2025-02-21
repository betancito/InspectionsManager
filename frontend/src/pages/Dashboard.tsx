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
import axios from "axios";
import EditInspectionModal, { Inspection } from "../components/dashboard/EditModal";
import DetailsInspectionModal from "../components/dashboard/DetailsModal";
import { useAuth } from "../context/AuthContext";
import CreateInspectionModal from "../components/dashboard/CreateModal";
import { Inspection as InspectionToSave } from "../components/dashboard/CreateModal";

const Dashboard: React.FC = () => {
  const {isAdmin, logout} = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // States for modals:
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  //Initial fetcher for populating inspections
  const fetchInspections = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      const response = await axios.get("http://localhost:8000/api/v1/inspections/", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setInspections(response.data);
    } catch (err) {
      console.error("Error fetching inspections:", err);
      setError("Failed to fetch inspections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleEditClick = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setEditModalOpen(true);
  };

  const handleDetailsClick = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDetailsModalOpen(true);
  };

  // onSave handler for inspection edit modal
  const handleSaveEdit = async (updatedInspection: Inspection) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      
      // Update via your API (PUT/PATCH request)
      await axios.put(`http://localhost:8000/api/v1/inspections/${updatedInspection.id}/`, updatedInspection, {
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
      // Optionally, display an error message
    }
  };

  //onSave handler for inspection create modal
  const handleCreate = async (newInspection: InspectionToSave) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      // Create via your API (POST request)
      const response = await axios.post("http://localhost:8000/api/v1/inspections/", newInspection, {
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

  //onDelete handler
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found.");
      await axios.delete(`http://localhost:8000/api/v1/inspections/${id}/`, {
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
        <Button variant="contained" color="primary" onClick={()=>setCreateModalOpen(true)}>
          Crear inspección
        </Button>
        <Button onClick={logout}>Salir de la cuenta</Button>
      </div>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Fecha de inspección</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.id}</TableCell>
                  <TableCell>{inspection.title}</TableCell>
                  <TableCell>{inspection.due_date}</TableCell>
                  <TableCell>
                    { isAdmin &&
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick(inspection)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Editar
                    </Button>
                    }
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleDetailsClick(inspection)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Detalles
                    </Button>
                    { isAdmin &&
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

      {/* Details Modal */}
      <DetailsInspectionModal
        open={detailsModalOpen}
        inspection={selectedInspection}
        onClose={() => setDetailsModalOpen(false)}
      />

      {/* Create modal */}
      <CreateInspectionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />
    </Container>
  );
};

export default Dashboard;
