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

const Dashboard: React.FC = () => {
  const {isAdmin, logout} = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // States for modals:
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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

  // Example onSave handler for the edit modal
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

  return (
    <Container maxWidth="lg" className="mt-10">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button onClick={logout}>Salir de la cuenta</Button>
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
                      onClick={() => console.log("Delete", inspection.id)}
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
    </Container>
  );
};

export default Dashboard;
