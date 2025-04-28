import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../utils/types";
import { redirect } from "react-router-dom";
interface RegisterState {
    username: string;
    password: string;
    confirm_password: string;
    email: string;
    first_name: string;
    last_name: string;
    role_group: string;
    loading: boolean;
    error: string | null
}

const initialState:RegisterState = {
    username: '',
    password: '',
    confirm_password: '',
    email: '',
    first_name: '',
    last_name: '',
    role_group: '',
    loading: false,
    error: null,
}

export const register = createAsyncThunk(
    'auth/register',
    async(register:RegisterState, {rejectWithValue}) => {
        try {
            await axios.post(
                `${API_URL}/register/`, register
            )
            return register;
        } catch (e){
            console.error("Register Failed", e)
            return rejectWithValue(`Registro fallido`)
        }
            
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Handle register states
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state)=> {
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default registerSlice.reducer;