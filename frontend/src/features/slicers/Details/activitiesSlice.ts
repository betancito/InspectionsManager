import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Activity {
  open: boolean;
  activityId: number | null;
  inspectionId: number | null;
  title: string;
  description: string;
  inChargeOf: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  error: string | null;
}

interface CheckActivityState {
  activities : Activity[];
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CheckActivityState = {
  activities: [],
  loading: 'idle',
  error: null,
};

//Thunk for fetching activities
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (inspectionId: number, { rejectWithValue }) => {
    try{
      const response = await axios.get(`${API_URL}/activities/inspection/${inspectionId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      return rejectWithValue("Error fetching activities");
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    //Add activity if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
  }
});

export default activitiesSlice.reducer;