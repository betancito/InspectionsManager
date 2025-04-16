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
    created_by: number;
    updated_by: number;
    latitude: number;
    longitude: number;
    completed: boolean;
    completed_description: string;
    completed_lat: number;
    completed_log: number;
    completed_file: string;
    completed_editedFile: string;
}

export interface ActivityModel {
    id: number;
    InspectionId: number;
    title: string;
    description: string;
    in_charge_of: string;
    latitude: number;
    longitude: number;
    status: ActivityStatus;
    created_at: string;
    updated_at: string;
}

export enum ActivityStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}