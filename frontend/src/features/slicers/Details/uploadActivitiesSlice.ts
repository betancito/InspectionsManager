import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { InspectionModel } from '../../../utils/types';

const API_URL = import.meta.env.VITE_API_URL;

export interface ActivityPayload {
  title: string;
  description: string;
  in_charge_of: string;
  latitude: number;
  longitude: number;
}

interface ExcelUploadState {
  fileName: string | null;
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ExcelUploadState = {
  fileName: null,
  uploadStatus: 'idle',
  error: null,
};


let parsedActivities: ActivityPayload[] = [];


export const uploadExcelData = createAsyncThunk<
  void,
  { inspection: InspectionModel },
  { rejectValue: string }
>(
  'excelUpload/uploadExcelData',
  async ({ inspection }, { rejectWithValue }) => {
    if (parsedActivities.length === 0) {
      return rejectWithValue('No hay actividades para subir.');
    }
    const token = localStorage.getItem('access');
    if (!token) {
      return rejectWithValue('Token de autenticación no encontrado.');
    }

    const payload = parsedActivities.map(activity => ({
      ...activity,
    }));

    try {
      // send JSON array to backend
      await axios.post(
        `${API_URL}/inspection/${inspection.id}/activities/`, payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response?.data?.error || 'Falló la subida de datos.');
    }
  }
);

const excelUploadSlice = createSlice({
  name: 'excelUpload',
  initialState,
  reducers: {
    setExcelFile: (state, action: PayloadAction<File | null>) => {
      const file = action.payload;
      if (!file) {
        state.fileName = null;
        parsedActivities = [];
        return;
      }
      state.fileName = file.name;

      // parse file immediately into JSON
      const reader = new FileReader();
      reader.onload = evt => {
        const data = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // sheet_to_json returns an array of objects keyed by header row :contentReference[oaicite:0]{index=0}
        const raw: any[] = XLSX.utils.sheet_to_json(ws);
        parsedActivities = raw.map(row => ({
          title: row.title || row.Título,
          description: row.description || row.Descripción,
          in_charge_of: row.inChargeOf || row.Encargado,
          latitude: Number(row.latitude || row.Latitud),
          longitude: Number(row.longitude || row.Longitud),
          created_by: parseInt(localStorage.getItem('user_id') || '0'),
          updated_by: parseInt(localStorage.getItem('user_id') || '0'),
        }));
      };
      reader.readAsArrayBuffer(file);
    },
    clearExcel: state => {
      state.fileName = null;
      parsedActivities = [];
      state.uploadStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(uploadExcelData.pending, state => {
        state.uploadStatus = 'loading';
        state.error = null;
      })
      .addCase(uploadExcelData.fulfilled, state => {
        state.uploadStatus = 'succeeded';
      })
      .addCase(uploadExcelData.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setExcelFile, clearExcel } = excelUploadSlice.actions;
export default excelUploadSlice.reducer;
