import * as XLSX from 'xlsx';


//Helper for creating a template to be downloaded
export const createExcelTemplate = () => {

    const activities = [
        {
        title: "Inspección de Tuberías",
        description: "Revisar las tuberías en el sector norte para detectar posibles fugas",
        inChargeOf: "Juan Pérez",
        latitude: 19.4326,
        longitude: -99.1332
        },
        {
        title: "Mantenimiento Eléctrico",
        description: "Reemplazar cables dañados en sistema principal del edificio B",
        inChargeOf: "Ana García",
        latitude: 19.4327,
        longitude: -99.1334
        },
        {
        title: "Revisión de Válvulas",
        description: "Comprobar presión en válvulas de la zona sur según especificaciones",
        inChargeOf: "Carlos Rodríguez", 
        latitude: 19.4330,
        longitude: -99.1336
        },
        {
        title: "Limpieza de Filtros",
        description: "Realizar limpieza y mantenimiento de filtros en sistema de ventilación",
        inChargeOf: "María López",
        latitude: 19.4335,
        longitude: -99.1340
        },
        {
        title: "Calibración de Sensores",
        description: "Calibrar sensores de temperatura en todas las salas del primer piso",
        inChargeOf: "Roberto Díaz",
        latitude: 19.4340,
        longitude: -99.1345
        }
    ];
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(activities);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    
    // Generate file and trigger download
    XLSX.writeFile(workbook, "activities_template.xlsx");
}
  