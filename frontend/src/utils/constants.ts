//API env variable value
export const API_URL = import.meta.env.VITE_API_URL;

//Inspection Model
export interface InspectionModel {
    id: number;
    title: string;
    description: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    latitude: number;
    longitude: number;
    completed: boolean;
    completed_description: string;
    completed_lat: number;
    completed_log: number;
    completed_file: string;
    completed_editedFile: string;
}