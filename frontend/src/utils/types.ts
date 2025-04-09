//API env variable value
export const API_URL = import.meta.env.VITE_API_URL;

//Auth0 Keys
export const AUTH0_DOMAIN = import.meta.env.AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = import.meta.env.AUTH0_CLIENT_ID;
export const AUTH0_API_IDENTIFIER = import.meta.env.AUTH0_API_IDENTIFIER;


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