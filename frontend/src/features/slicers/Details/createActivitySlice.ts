import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { InspectionModel } from "../../../utils/types";
const API_URL = import.meta.env.VITE_API_URL;

interface Activity {
    title: string;
    description: string;
    inChargeOf: string;
    latitude: number;
    longitude: number;
}

interface CreateActivityState {
    open: boolean;
    inspection: InspectionModel | null;
    uploadStatus: "idle" | "loading" | "succeeded" | "failed";
    activity: Activity;
    error: string | null;
}

const initialState: CreateActivityState = {
    open: false,
    inspection: null,
    uploadStatus: "idle",
    activity: {
        title: "",
        description: "",
        inChargeOf: "",
        latitude: 0,
        longitude: 0,
    },
    error: null,
};

export const createActivity = createAsyncThunk(
    "createActivity/createActivity",
    async (_, {getState, rejectWithValue }) => {
        const state = getState() as { createActivity: CreateActivityState };
        const { activity, inspection } = state.createActivity;
        const { title, description, inChargeOf, latitude, longitude} = activity;

        //Checkers to see if user uploaded required information
        if (!title) {
            return rejectWithValue("Error, el título de la actividad no fue proveído");
        }
        if (!description) {
            return rejectWithValue("Error, la descripción de la actividad no fue proveída");
        }
        if (!inChargeOf) {
            return rejectWithValue("Error, la persona encargada de la actividad no fue proveída");
        }
        if (!latitude) {
            return rejectWithValue("Error, la latitud de la actividad no fue proveída");
        }
        if (!longitude) {
            return rejectWithValue("Error, la longitud de la actividad no fue proveída");
        }
        const token = localStorage.getItem("access");
        if (!token) {
            return rejectWithValue("Error en la authenticación, ingrese de nuevo");
        }

        const formData = {
            title: title,
            description: description,
            in_charge_of: inChargeOf,
            latitude: latitude,
            longitude: longitude,
        };
        try {
            const response = await axios.post(
                `${API_URL}/inspection/${inspection?.id}/activities/`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            return response.data;
            } catch (error) {
                console.log("Error creating activity:", error);
                return rejectWithValue("Error creating activity");
            }
    }
);

const createActivitySlice = createSlice({
    name: "createActivity",
    initialState,
    reducers: {
        openActivityModal: (state, action: PayloadAction<InspectionModel>) => {
            state.open = true;
            state.inspection = action.payload;
        },

        closeActivityModal: (state) => {
            state.open = false;
            state.activity = initialState.activity;
            state.error = null;
        },

        setActivity: (state, action: PayloadAction<Partial<Activity>>) => {
            state.activity = {
                ...state.activity,
                ...action.payload
            };
        },

        setActivityField: (state, action: PayloadAction<{field: keyof Activity, value: any}>) => {
            state.activity = {
                ...state.activity,
                [action.payload.field]: action.payload.value
            };
        },
    },
    extraReducers: (builder) => {
        builder
            //Reducers for uploading single activity
            .addCase(createActivity.pending, (state) => {
                state.uploadStatus = "loading";
                state.error = null;
            })
            .addCase(createActivity.fulfilled, (state, action) => {
                state.uploadStatus = "succeeded";
                state.open = false;
                state.activity = initialState.activity;
            })
            .addCase(createActivity.rejected, (state, action) => {
                state.uploadStatus = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { openActivityModal, closeActivityModal, setActivity, setActivityField } = createActivitySlice.actions;
export default createActivitySlice.reducer;
   
