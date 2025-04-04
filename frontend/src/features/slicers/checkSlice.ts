import { createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

interface CheckModalState {
    open: boolean;
    inspectionId: number| null;
    latitude: number|null;
    longitude: number|null ;
    description: string;
    photo: File| null;
    uploadStatus: "idle" | 'loading' | 'succeeded' | "falied";
    error: string| null;
}

const initialState: CheckModalState = {
    open:false,
    inspectionId: null,
    latitude: null,
    longitude: null,
    description: '',
    photo: null, 
    uploadStatus: "idle",
    error: null,
};

//Thunk for file upload to API
export const completeInspection = createAsyncThunk(
    "checkModal/completeInspection",
    async (_, { getState, rejectWithValue }) => {
      const state = getState() as { checkModal: CheckModalState };
      const { inspectionId, latitude, longitude, description, photo } = state.checkModal;
      
      if (!inspectionId) {
        return rejectWithValue("Error, la ID de la inspección no fue proveida");
      }

      //Check if photo before saving
      if (!photo) {
        return rejectWithValue("Porfavor selecciona una imagen de la inspección");
      }

      if (!latitude) {
        return rejectWithValue("Porfavor Provee la latitud donde se realizó la inspección");
      }

      if (!longitude) {
        return rejectWithValue("Porfavor Provee la Longitud donde se realizó la inspección");
      }

      //Collect Token from localStorage
      const token = localStorage.getItem("access");
      if (!token){
        return rejectWithValue("Error en la authenticación ingrese de nuevo")
      }


  
      const formData = new FormData();
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("description", description);
      formData.append("photo", photo);
  
      try {
        const response = await axios.put(
          `http://localhost:8000/api/v1/inspections/complete/${inspectionId}`,
          formData,
          {
            headers: { 
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
          }
        );
        console.log()
        return response.data; // assume this returns the updated inspection data
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Completion failed");
      }
    }
  );
  


const checkModalSlice = createSlice({
    name: 'checkModal',
    initialState,
    reducers:{
        openCheckModal: (state, action: PayloadAction<number>) => {
            state.open = true;
            state.inspectionId = action.payload;
        },
        closeCheckModal: (state) => {
            state.open = false;
            state.inspectionId = null;
            state.latitude = null;
            state.longitude = null;
            state.description = '';
            state.photo = null;
        },
        setLatitude: (state, action: PayloadAction<number>) => {
            state.latitude = action.payload;
        },
        setLongitude: (state, action: PayloadAction<number>) => {
            state.longitude = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setPhoto: (state, action: PayloadAction<File | null>) => {
            state.photo = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(completeInspection.pending, (state) => {
          state.uploadStatus = "loading";
          state.error = null;
        })
        .addCase(completeInspection.fulfilled, (state, action: PayloadAction<any>) => {
          state.uploadStatus = "succeeded";
          // Optionally, update additional state based on response here
        })
        .addCase(completeInspection.rejected, (state, action: PayloadAction<any>) => {
          state.uploadStatus = "falied";
          state.error = action.payload as string;
        });
    },
})

export const {openCheckModal, closeCheckModal, setLatitude, setLongitude, setDescription, setPhoto} = checkModalSlice.actions;
export default checkModalSlice.reducer;